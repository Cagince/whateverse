import * as _PIXI from "pixi.js";
import Bump from './Bump';

export const PIXI = global.PIXI = _PIXI;
require('pixi-projection');

const KEYS = { 
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
        this.convertTo2d();
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

        document.getElementById('user-position').innerHTML = `(${Math.floor(this.x)}, ${Math.floor(this.y)})`;
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

export default createCharacter;