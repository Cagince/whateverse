import React, { useRef, useEffect, useState } from "react";
import initWhateverse from './game';



function Whateverse({ }) {
    const canvas = useRef(null);
    const [room, setRoom] = useState(null);

    useEffect(_ => {
        if (canvas) initWhateverse(canvas.current, setRoom);
    }, [canvas]);


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
        </>
    );
}

export default Whateverse;