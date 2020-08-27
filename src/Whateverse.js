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




function RoomDetailsWindow({ room, destroy }) {

    const [minimized, setMinimized] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const tabKeys = Object.keys(room.data.urls);
    const [selectedTab, setSelectedTab] = useState(tabKeys[0]);


    return (
        <Draggable
            handle=".window-header"
            defaultPosition={{x: window.innerWidth - 320, y: 50}}
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
                        <div className="window-body">this should be the body</div>
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