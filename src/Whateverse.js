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




function createRoomDetailsWindow(room, key) {

    return (
        <Draggable
            key={`details-window-${key}`}
            handle=".handle"
            defaultPosition={{x: window.innerWidth - 300, y: 0}}
            position={null}
            scale={1}
        >
            <div className="room-window">
                <div className="handle">Drag from here</div>
                <div>This readme is really dragging on...</div>
            </div>
        </Draggable>
    );
}


function Whateverse({ }) {
    const canvas = useRef(null);
    const [room, setRoom] = useState(null);
    const [activeRooms, setActiveRooms] = useState({});
    const popUpRequested = useKeyPress('e');

    useEffect(_ => {
        if (canvas) initWhateverse(canvas.current, setRoom);
    }, [canvas]);

    useEffect(_ => {
        if (popUpRequested && room && !activeRooms[room.name]) {
            setActiveRooms({
                ...activeRooms,
                [room.name]: createRoomDetailsWindow(room, activeRooms.length)
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