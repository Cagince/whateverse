import React, { useRef, useEffect } from "react";
import "./App.css";
import * as _PIXI from "pixi.js";
import adventurerSheet from "./adventurer-Sheet.png";
import pyramidIMG from "./pyramid.svg";
import fortressIMG from "./fortress.svg";
import magincStonesIMG from "./magic_stones.svg";
import townhallIMG from "./townhall.svg";
import universityIMG from "./university.svg";
import baseSheet from "./base_sprite.gif";
import Bump from './Bump';
// import * as proj from 'pixi-projection/dist/pixi-projection';

const PIXI = global.PIXI = _PIXI;
require('pixi-projection');

const container2dToLocal  = () => '';

export const Rooms = {
  "House of Defiance": {
    src: pyramidIMG,
    coordinates: [-250, -250],
    urls: {
      jitsi: {
        domain: "meet.jit.si/interspace-metagame",
        roomName: "House of Defiance",
      },
      mozillaHub: {
        externalUrl: "https://hubs.mozilla.com/nKCuNrg/house-of-defiance",
      },
      youtube: {
        videoId: "X5k8Cbr0d44",
        externalUrl: "https://youtu.be/X5k8Cbr0d44",
      },
    },
  },
  "House of DAOs": {
    src: universityIMG,
    coordinates: [-110, -415],
    urls: {
      jitsi: {
        domain: "meet.jit.si/interspace-metagame",
        roomName: "House of DAOs",
      },
      mozillaHub: {
        externalUrl: "https://hubs.mozilla.com/eJZGNU5/house-of-daos",
      },
      youtube: {
        videoId: "k0UpUwmKaHc",
        externalUrl: "https://youtu.be/k0UpUwmKaHc",
      },
    },
  },
  "House of Adoption": {
    src: townhallIMG,
    coordinates: [145, -390],
    urls: {
      jitsi: {
        domain: "meet.jit.si/interspace-metagame",
        roomName: "House of Adoption",
      },
      mozillaHub: {
        externalUrl: "https://hubs.mozilla.com/tpKKcfA/house-of-adoption",
      },
      youtube: {
        videoId: "_DxQQKrxYFI",
        externalUrl: "https://youtu.be/_DxQQKrxYFI",
      },
    },
  },
  "Stress Test Arena": {
    src: magincStonesIMG,
    coordinates: [150, 200],
    urls: {
      jitsi: {
        domain: "meet.jit.si/interspace-metagame",
        roomName: "Stress Test Arena",
      },
      mozillaHub: {
        externalUrl: "https://hubs.mozilla.com/nx5rV57/stress-test-arena",
      },
      youtube: {
        videoId: "pWfUAjIgoJM",
        externalUrl: "https://youtu.be/pWfUAjIgoJM",
      },
    },
  },
  "Raid Guild": {
    src: fortressIMG,
    coordinates: [310, -190],
    urls: {
      jitsi: {
        domain: "meet.jit.si/interspace-metagame",
        roomName: "Raid Guild",
      },
      mozillaHub: {
        externalUrl: "https://hubs.mozilla.com/LmrJQqL/raid-guild",
      },
      youtube: {
        videoId: "f2bnDe5-3mM",
        externalUrl: "https://youtu.be/p7gJTpauAgk",
      },
    },
  },
};

var KEYS = { 
  w: 87, 
  a: 65, 
  s: 83, 
  d: 68,
  h: 72,
  j: 74,
  k: 75,
  l: 76,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
};



class Building extends PIXI.projection.Sprite2d {
  constructor(name, texture, x, y) {
    super(texture);
    this.anchor.set(0.5, 1.0);
    this.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.scale.set(1, ); // .5, .5  from more real-like buildings
    this.x = x;
    this.y = y;
    this.radius = this.width / 2.3;
    this.name = name;
    this.optionsVisible = false;

  }

  addCircle() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.drawCircle(0, 0, this.width / 1.5);
    graphics.endFill();
    const text = new PIXI.Text(this.name, { 
      fill: 0xffffff, 
      fontSize: 15,
      align: 'center',
    });
    text.position.x = this.width / 2 ;
    text.position.y = -this.width / 2 - 15 ;

    this.addChild(graphics);
    this.addChild(text);
    this.optionsVisible = true;
  }

  showOptions(character) {
    const dx = this.x - character.x;
    const dy = this.y - character.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const isCloseEnough = distance < this.width / 1.5 + character.width / 2
    
    if (isCloseEnough && !this.optionsVisible) {
      this.addCircle();
      return;
    }

    if (!isCloseEnough && this.optionsVisible) {
      this.removeChildren(0);
      this.optionsVisible = false;
    }

  }

}


const createCharacter = (sheet, ...rest) => {
  const w = 48;
  const h = 72;

  const sprite = {
      idle_down: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h)),
      ],
      idle_left: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 0, w, h)),
      ],
      idle_up: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 0, w, h)),
      ],
      idle_right: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 0, w, h)),
      ],
      walking_down: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 1 * h, w, h)),

      ],
      walking_left: [

        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 2 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 2 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 2 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 2 * h, w, h)),
      ],
      walking_up: [

        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 3 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 3 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 3 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 3 * h, w, h)),
      ],
      walking_right: [

        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 4 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 4 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 4 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 4 * h, w, h)),
      ]

      //   new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 0, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(5 * w, 0, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 0, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(7 * w, 0, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 1 * h, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 1 * h, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 1 * h, w, h)),
      //   new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 1 * h, w, h)),
      //   // new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 1 * h, w, h)),
      //   // new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 1 * h, w, h)),
      //   // new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 1 * h, w, h)),
      // ]
  }

  return new Character(sprite, ...rest);
}

class Character extends  PIXI.AnimatedSprite {

  constructor(sheet, x, y, name) {
    super(sheet.idle_down);
    this.convertTo3d();
    this._ssheet = sheet;
    this.anchor.set(0.5, 1.0);
    this.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    this.scale.set(1, ); // .5, .5  from more real-like buildings
    this.animationSpeed = 0.1;
    this.autoUpdate = true;
    this.loop = true;
    
    this.name = name || "none";
    this.x = x;
    this.y = y;
    this.state = 'idle';
    this.facing = 'down';

    this.radius = this.width / 2;

    this.scale.x = 0.75;
    this.scale.y = 0.75;

    const reach = new PIXI.Graphics();
    reach.lineStyle(2, 0xFEEB77, 1);

    this.addChild(reach);
  }

  hitTest = (building) => {
    const b = new Bump(PIXI);
    return b.circleCollision(this, building);
  }


  onTick(pressedKeys, maxX, maxY, buildings) {

    this.state = 'idle'
    const collisions = buildings.map(this.hitTest).filter(Boolean);
    buildings.forEach(b => b.showOptions(this));

    if (pressedKeys[KEYS.w] || pressedKeys[KEYS.k] || pressedKeys[KEYS.up]) {
      this.facing = 'up'
      this.state = 'walking'
      const y = this.y - 5;

      if (/* y > 8 && **/ !collisions.includes('top')) this.y = y;
    }

    if (pressedKeys[KEYS.a] || pressedKeys[KEYS.h] || pressedKeys[KEYS.left]) {
      this.facing = 'left'
      this.state = 'walking'
      const x = this.x - 5;
      // this.scale.x *= this.scale.x > 0 ? -1 : 1;
      
      if (/* x > 8 && **/ !collisions.includes('left')) this.x = x;
    }

    if (pressedKeys[KEYS.s] || pressedKeys[KEYS.j] || pressedKeys[KEYS.down]) {
      this.facing = 'down'
      this.state = 'walking'
      const y = this.y + 5;

      if (/* y < maxY - 8 && **/ !collisions.includes('bottom')) this.y = y;
    }

    if (pressedKeys[KEYS.d] || pressedKeys[KEYS.l] || pressedKeys[KEYS.right]) {
      this.facing = 'right'
      this.state = 'walking'
      const x = this.x + 5;
      // this.scale.x *= this.scale.x > 0 ? 1 : -1;

      if (/* x < maxX - 8 && **/ !collisions.includes('right')) this.x = x;
    }

    const sheetID = [this.state, this.facing].join('_');
    if (this.textures != this._ssheet[sheetID]) {
      this.textures = this._ssheet[[this.state, this.facing].join('_')];
      this.animationSpeed = 0.1;
    }

    document.getElementById('user-position-tracker').innerHTML = `(${this.x}, ${this.y})`;
    this.play();
  }

  updateState(running) {
    if (running && this.textures != this._ssheet.running) {
      this.textures = this._ssheet.running;
      this.animationSpeed = 0.2;
    } 
    if (!running && this.textures !== this._ssheet.idle) {
      this.textures = this._ssheet.idle;;
      this.animationSpeed = 0.1;
    } 
  }
}

const createKeyHandler = (cb) => (e) => cb(e.keyCode);


function drawGround(container) {
  const isometryPlane = new PIXI.Graphics();
  isometryPlane.rotation = Math.PI / 4;
  container.addChild(isometryPlane);

  isometryPlane.lineStyle(1, 0x000000);
  for(let i = -1000; i <= 1000; i += 50 )  {
    isometryPlane.moveTo(-1050, i);
    isometryPlane.lineTo(1050, i);
    isometryPlane.moveTo(i, -1050);
    isometryPlane.lineTo(i, 1050);
  }
}


function initWhateverse(canvas) {
  
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x464643,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    view: canvas,
  });

  
  const world = new PIXI.Container();
  app.stage.addChild(world);

  const isoScalingContainer = new PIXI.Container();
  isoScalingContainer.scale.y = 0.5;
  isoScalingContainer.position.set(0, 0);
  world.addChild(isoScalingContainer);

  drawGround(isoScalingContainer);
  

  const loader = PIXI.Loader.shared;

  loader.add('character', baseSheet);
  Object.keys(Rooms).forEach(key => loader.add(key, Rooms[key].src))


  const setup = (_, resources) => {

    // create Player
    // const characterTexture = PIXI.BaseTexture.from(adventurerSheet);
    const player = createCharacter(
      resources.character.texture,
      30,
      -241,
      "you"
    );
    player.play();

    // setup Buildings
    const buildings = Object.keys(Rooms).map(key => {
      const room = Rooms[key];
      const building = new Building(key, resources[key].texture, ...room.coordinates);
      return building;
    });

    isoScalingContainer.addChild(player);
    buildings.forEach(building => isoScalingContainer.addChild(building));
    let keys = {};


    const updateCameraPosition = ()  => {
      isoScalingContainer.pivot.x = player.position.x;
      isoScalingContainer.pivot.y = player.position.y;

      world.pivot.x = isoScalingContainer.position.x;
      world.pivot.y = isoScalingContainer.position.y;
      world.position.x = app.renderer.width/2;
      world.position.y = app.renderer.height/2;
    }

    const loop = () => {
      player.onTick(keys, app.renderer.width, app.renderer.height, buildings);
      updateCameraPosition();
    };




    const handleKeyDown = createKeyHandler((key) => (keys[key] = true));
    const handleKeyUp = createKeyHandler((key) => (keys[key] = false));
    app.ticker.add(loop);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  }

  loader.load(setup);
  
}

function App() {
  const canvas = useRef(null);

  useEffect(
    (_) => {
      if (canvas) {
        initWhateverse(canvas.current);
      }
    },
    [canvas]
  );

  return (
    <div>
      <div id="user-position-tracker">(0,0)</div>
      <canvas ref={canvas} />
    </div>
  );
}

export default App;
