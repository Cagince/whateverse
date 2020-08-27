import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import './stars.css';

import StarfieldAnimation from 'react-starfield-animation';


import Whateverse from "./Whateverse";





function App() {

  return (
    <div>
      <StarfieldAnimation
				numParticles={300}
				lineWidth={2.0}
				depth={300}
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
				}}
			/>
      {/* {selectedRoom && 
        <div className="selected-room">
          {selectedRoom.name}
        
        </div>
      } */}
      <Whateverse />
    </div>
  );
}

export default App;
