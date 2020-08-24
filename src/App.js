import React, { useRef, useEffect } from 'react';
import './App.css';
import * as PIXI from 'pixi.js';
import adventurerImg from './adventurer.png';

function initWhateverse(wrapper) {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1
  });

  const container = new PIXI.Container();
  app.stage.addChild(container);


  const texture = PIXI.Texture.from(adventurerImg);
  const adventurer = new PIXI.Sprite(texture);
  adventurer.anchor.set(0.5);
  adventurer.x = app.renderer.width / 2;
  adventurer.y = app.renderer.height / 2;
  container.addChild(adventurer);

  wrapper.appendChild(app.view);

}


function App() {
  const wrapper = useRef(null);

  useEffect(_ => {
    if (wrapper) {
      initWhateverse(wrapper.current);
    }
  }, [wrapper]);

  return (
    <div {...{ ref: wrapper }} />
  );
}

export default App;
