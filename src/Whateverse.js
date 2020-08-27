import React, { useRef, useEffect, useState } from "react";
import initWhateverse from './game';



function Whateverse({ }) {
    const canvas = useRef(null);
    const [room, setRoom] = useState(null);

    useEffect(_ => {
        if (canvas) initWhateverse(canvas.current, setRoom);
    }, [canvas]);


    return <canvas ref={canvas} />;
}

export default Whateverse;