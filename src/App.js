import React, { useRef, useEffect } from "react";
import "./App.css";
import * as PIXI from "pixi.js";
import adventurerSheet from "./adventurer-Sheet.png";
import pyramidIMG from "./pyramid.svg";
import fortressIMG from "./fortress.svg";
import magincStonesIMG from "./magic_stones.svg";
import townhallIMG from "./townhall.svg";
import universityIMG from "./university.svg";
import Bump from './Bump';

export const Rooms = {
  "House of Defiance": {
    src: pyramidIMG,
    coordinates: [100, 300],
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
    coordinates: [500, 100],
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
    coordinates: [750, 300],
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
    coordinates: [750, 600],
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
    coordinates: [100, 600],
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

class Building extends PIXI.Sprite {
  constructor(name, texture, x, y) {
    super(texture);
    this.anchor.set(0.5);
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
    const isCloseEnough = distance < this.width / 1.5
    
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
  const w = 50;
  const h = 37;

  const sprite = {
      idle: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 0, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 0, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 0, w, h)),
      ],
      running: [
        new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(5 * w, 1 * h, w, h)),
        new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 1 * h, w, h)),
      ]
  }

  return new Character(sprite, ...rest);
}

class Character extends PIXI.AnimatedSprite {

  constructor(sheet, x, y, name) {
    super(sheet.idle);
    this._ssheet = sheet;
    this.anchor.set(0.5);
    this.animationSpeed = 0.1;
    this.autoUpdate = true;
    this.loop = true;
    
    this.name = name || "none";
    this.x = x;
    this.y = y;

    this.radius = this.width / 2;

    const reach = new PIXI.Graphics();
    reach.lineStyle(2, 0xFEEB77, 1);

    this.addChild(reach);
  }

  hitTest = (building) => {
    const b = new Bump(PIXI);
    return b.circleCollision(this, building);
  }


  onTick(pressedKeys, maxX, maxY, buildings) {
    let running = false;

    const collisions = buildings.map(this.hitTest).filter(Boolean);
    buildings.forEach(b => b.showOptions(this));

    if (pressedKeys[KEYS.w] || pressedKeys[KEYS.k] || pressedKeys[KEYS.up]) {
      const y = this.y - 5;
      running = true;

      if (y > 8 && !collisions.includes('top')) this.y = y;
    }

    if (pressedKeys[KEYS.a] || pressedKeys[KEYS.h] || pressedKeys[KEYS.left]) {
      const x = this.x - 5;
      running = true;
      this.scale.x *= this.scale.x > 0 ? -1 : 1;
      
      if (x > 8 && !collisions.includes('left')) this.x = x;
    }

    if (pressedKeys[KEYS.s] || pressedKeys[KEYS.j] || pressedKeys[KEYS.down]) {
      const y = this.y + 5;
      running = true;

      if (y < maxY - 8 && !collisions.includes('bottom')) this.y = y;
    }

    if (pressedKeys[KEYS.d] || pressedKeys[KEYS.l] || pressedKeys[KEYS.right]) {
      const x = this.x + 5;
      running = true;
      this.scale.x *= this.scale.x > 0 ? 1 : -1;

      if (x < maxX - 8 && !collisions.includes('right')) this.x = x;
    }

    this.updateState(running);
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

function initWhateverse(canvas) {
  
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x32CD32,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    view: canvas,
  });


  const container = new PIXI.Container();
  app.stage.addChild(container);

  const loader = PIXI.Loader.shared;

  loader.add('character', adventurerSheet);
  Object.keys(Rooms).forEach(key => loader.add(key, Rooms[key].src))


  const setup = (_, resources) => {

    // create Player
    // const characterTexture = PIXI.BaseTexture.from(adventurerSheet);
    const player = createCharacter(
      resources.character.texture,
      app.renderer.width / 2,
      app.renderer.height / 2,
      "you"
    );
    player.play();

    // setup Buildings
    const buildings = Object.keys(Rooms).map(key => {
      const room = Rooms[key];
      const building = new Building(key, resources[key].texture, ...room.coordinates);
      return building;
    });

    container.addChild(player);
    buildings.forEach(building => container.addChild(building));
    let keys = {};

    const loop = () => {
      player.onTick(keys, app.renderer.width, app.renderer.height, buildings);
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
      <canvas ref={canvas} />
    </div>
  );
}

export default App;
