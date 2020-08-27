import React, { useRef, useEffect, useState } from "react";
import Draggable from 'react-draggable';
import initWhateverse from './game';


function useKeyPress(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}


function HubInstance({width, height, roomData}) {
    console.log('here')
    console.log()
    return (
        <iframe
            title="Mozilla hub conference room"
            width={width}
            height={height}
            frameBorder="0"
            src={roomData.embedUrl}
            allow="microphone; camera; vr; speaker;"
        />
    );
}

function YoutubeInstance({width, height, roomData}) {
    return (
        <iframe
            title="Youtube conference room"
            width={width}
            height={height}
            src={`https://www.youtube.com/embed/${roomData.videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
}

const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;

const JitsiInstance = ({ width, height, roomData }) => {
	const root = useRef(null);

	useEffect(() => {
		const options = {
			roomName: roomData.roomName,
			width: '100%',
			height: '100%',
			parentNode: root.current,
		};
		const api = new JitsiMeetExternalAPI(roomData.domain, options);

		return function cleanup() {
			api.dispose();
		};
	}, [roomData, width, height]);

	return <div ref={root} style={{height: '100%'}}></div>;
};



function RoomDetailsWindow({ room, destroy }) {

    const [minimized, setMinimized] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const tabKeys = Object.keys(room.data.urls);
    const [selectedTab, setSelectedTab] = useState(tabKeys[0]);


    return (
        <Draggable
            handle=".window-header"
            defaultPosition={{x: window.innerWidth - 620, y: 50}}
            onStart={_ => false}
            // position={ fullScreen && !minimized ? { x: 0, y: 0 } : null}
            scale={1}
        >
            <div className={`window ${fullScreen && !minimized ? 'fullscreen' : '' } ${minimized ? 'minimized' : ''}`}>
                <div className="window-header">
                    <span>{room.name || "Name placeholder"}</span>
                    <div className="window-header-actions">
                        <span {...{
                            className: minimized ? 'active' : '',
                            onClick: _ => setMinimized(!minimized),
                            children: '⚊'
                        }} />
                        <span {...{ 
                            className: fullScreen && !minimized ? 'active' : '',
                            onClick: _ => {
                                if (minimized) setMinimized(false);
                                setFullScreen(!fullScreen);
                            },
                            children: '☐'
                        }} />
                        <span {...{ onClick: _ => destroy(room), children: '☓' }} />
                    </div>
                </div>
                {!minimized &&
                    <>
                        <div className="window-body">
                            {selectedTab === 'mozillaHub' &&
                                <HubInstance {...{ roomData: room.data.urls[selectedTab], width: '100%', height: '100%' }}/> 
                            }
                            {selectedTab === 'youtube' &&
                                <YoutubeInstance {...{ roomData: room.data.urls[selectedTab], width: '100%', height: '100%' }}/> 
                            }
                            {selectedTab === 'jitsi' &&
                                <JitsiInstance {...{ roomData: room.data.urls[selectedTab], width: '100%', height: '100%' }}/> 
                            }
                        </div>
                        <div className="window-footer">
                            {tabKeys.map((t, i) => (
                                <span {...{
                                    key: `${room.name.replace(' ', '-')}-tab-${i}`,
                                    className: selectedTab === t ? 'selected' : '',
                                    onClick: _ => setSelectedTab(t),
                                    children: t
                                }}/>
                            ))}
                        </div>
                    </>
                }
            </div>
        </Draggable>

    )
}


function createRoomDetailsWindow(room, key, destroy) {


    return ( <RoomDetailsWindow {...{ room, destroy, key: `details-window-${key}` }} />);
}


function Whateverse({ }) {
    const canvas = useRef(null);
    const [room, setRoom] = useState(null);
    const [activeRooms, setActiveRooms] = useState({});
    const popUpRequested = useKeyPress('e');

    const removeRoom = room => {
        console.log(room);
        const rooms = {...activeRooms };
        console.log(rooms);
        delete rooms[room.name];
        console.log(rooms);
        console.log('------------------');
        setActiveRooms(rooms);
    }

    useEffect(_ => {
        if (canvas) initWhateverse(canvas.current, setRoom);
    }, [canvas]);

    useEffect(_ => {
        if (popUpRequested && room && !activeRooms[room.name]) {
            setActiveRooms({
                ...activeRooms,
                [room.name]: createRoomDetailsWindow(room, Object.keys(activeRooms).length, removeRoom)
            });
        }

    }, [popUpRequested, room, activeRooms]);



    const windows = Object.values(activeRooms);

    return (
        <>
            <canvas ref={canvas} />;

            <div className="user-position-tracker">
                <span>You</span>
                <span><small id="user-position" /></span>
            </div>
            {room && 
                <div className="selected-room">
                    <span>{room.name}</span>
                    <span><small>[{room.x}, {room.y}]</small></span>
                </div>
            
            }
            <div className="window-wrapper">
                {windows}
            </div>
        </>
    );
}

export default Whateverse;