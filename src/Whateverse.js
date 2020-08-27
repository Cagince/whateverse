import React, { useRef, useEffect, useState, useReducer } from "react";
import initWhateverse from './game';
import { Rnd } from 'react-rnd'


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

function FrameInstance({ width, height, roomData }) {
    return (
        <iframe
            width={width}
            height={height}
            frameBorder="0"
            src={roomData.domain}
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
    const tabKeys = Object.keys(room.urls);
    const [selectedTab, setSelectedTab] = useState(tabKeys[0]);

    const [state, setState] = useState({
        x:  window.innerWidth / 1.5,
        y: room.id * 50,
        width: 600,
        height: 300
    });

    const { width, height, x, y } = state;

    let size = { 
        width: fullScreen ? '100vw' : (minimized ? '300px' : width), 
        height: fullScreen ? '100vh'  : (minimized ? 25 : height),
    };
    let position =  { 
        x: fullScreen ? 0 : x, 
        y: fullScreen ? 0 : y, 
    };

    return (
        <Rnd {...{
            size,
            position,
            onDragStop: (_, { x, y}) => (!fullScreen && setState({...state, x, y })) || true,
            onResizeStop: ((e, d, ref, dl, position) => (!fullScreen && !minimized &&
                setState({ 
                    ...state, 
                    width: ref.style.width,
                    height: ref.style.height
                })) || true
            ),
        }}>
            <div className={`window ${fullScreen && !minimized ? 'fullscreen' : '' } ${minimized ? 'minimized' : ''}`}>
                <div className="window-header">
                    <span>{room.name} | {selectedTab}</span>
                    <div className="window-header-actions">
                        <span {...{
                            className: minimized ? 'active' : '',
                            onClick: _ => setMinimized(!minimized),
                            children: '⚊'
                        }} />
                        <span {...{ 
                            className: fullScreen && !minimized ? 'active' : '',
                            onClick: _ => {
                                setMinimized(false);
                                setFullScreen(!fullScreen);
                            },
                            children: '☐'
                        }} />
                        <span {...{ onClick: _ => destroy(room.name), children: '☓' }} />
                    </div>
                </div>
                <div className={`window-body ${selectedTab.replace('.', '-')}`}>
                    {selectedTab === 'mozillaHub' &&
                        <HubInstance {...{ roomData: room.urls[selectedTab], width: '100%', height: '100%' }}/> 
                    }
                    {selectedTab === 'youtube' &&
                        <YoutubeInstance {...{ roomData: room.urls[selectedTab], width: '100%', height: '100%' }}/> 
                    }
                    {selectedTab === 'jitsi' &&
                        <JitsiInstance {...{ roomData: room.urls[selectedTab], width: '100%', height: '100%' }}/> 
                    }
                    {selectedTab === 'loft.radio' &&
                        <FrameInstance {...{ className: 'radio', roomData: room.urls[selectedTab], width: '100%', height: '100%' }}/> 
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
            </div>
        </Rnd>

    )
}


function createRoomDetailsWindow(room, key, destroy) {


    return ( <RoomDetailsWindow {...{ room, destroy, key: `details-window-${key}` }} />);
}


function reducer(state, action) {
    switch(action.type) {
        case 'add':
            const { room } = action.payload;
            return { ...state, [room.name]: room };
        case 'remove':
            console.log(action)
            const newState = {...state};
            delete newState[action.payload.roomKey];
            return { ...newState };
        default: 
            return { ...state };
    }
}


function Whateverse({ }) {
    const canvas = useRef(null);
    const [activeRooms, dispatch] = useReducer(reducer, {});

    const addRoom = (room) => dispatch({ type: 'add', payload: {room} });
    const removeRoom = (roomKey) => dispatch({ type: 'remove', payload: {roomKey}});
    const [room, setRoom] = useState(null);

    const popUpRequested = useKeyPress('e');


    useEffect(_ => {
        if (canvas) initWhateverse(canvas.current, setRoom);
    }, [canvas]);

    useEffect(_ => {
        if (popUpRequested && room && !activeRooms[room.name]) {
            addRoom({
                name: room.name,
                ...room.data
            });
        }

    }, [popUpRequested, room, activeRooms]);


    // const windows = [];
    const windows = Object.keys(activeRooms).map(key => createRoomDetailsWindow(
        activeRooms[key], key, removeRoom
    ));

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