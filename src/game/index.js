import baseSheet from "./media/base_sprite.gif";
import { screenToIso } from './utils';

import createCharacter from './Character';
import Building from './Building';

import { Rooms } from './constants/rooms';

import * as _PIXI from "pixi.js";
export const PIXI = global.PIXI = _PIXI;
require('pixi-projection');




const createKeyHandler = (cb) => (e) => cb(e.keyCode);


function drawGround(container) {
    const isometryPlane = new PIXI.Graphics();
    isometryPlane.rotation = Math.PI / 4;
    container.addChild(isometryPlane);

    // isometryPlane.lineStyle(1, 0xFF247C);
    isometryPlane.lineStyle(1, 0x0dc3cf);
    for(let i = -1000; i <= 1000; i += 50 )  {
        isometryPlane.moveTo(-1050, i);
        isometryPlane.lineTo(1050, i);
        isometryPlane.moveTo(i, -1050);
        isometryPlane.lineTo(i, 1050);
    }
}


function initWhateverse(canvas, setSelectedRoom) {
    
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        // backgroundColor: 0x464643,
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
        ...screenToIso(0,0),
        "you"
        );
        player.play();

        // setup Buildings
        const buildings = Object.keys(Rooms).map(key => {
        const room = Rooms[key];
        const building = new Building(key, resources[key].texture, ...room.coordinates, setSelectedRoom);
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


export default initWhateverse;