import { Rooms } from './constants/rooms';
import { screenToIso } from './utils';

const PIXI = global.PIXI;

export default class Building extends PIXI.projection.Sprite2d {
    constructor(name, texture, x, y, data, handleCharacterCollision) {
        super(texture);
        this.anchor.set(0.5, 1.0);
        this.proj.affine = PIXI.projection.AFFINE.AXIS_X;
        this.scale.set(1); // .5, .5  from more real-like buildings
        this.x = x;
        this.y = y;
        this.data = data;
        this.radius = this.width / 2.3;
        this.name = name;
        this.optionsVisible = false;
        this.handleCharacterCollision = handleCharacterCollision;
    }

    addCircle() {
        const graphics = new PIXI.Graphics();
        graphics.scale.y = 0.5;
        graphics.lineStyle(2, 0xff247c, 1);
        graphics.drawCircle(
        ...screenToIso(this.width, -this.height / 2),
        this.width
        );
        graphics.endFill();
        const text = new PIXI.Text(this.name, {
        fill: 0xff247c,
        fontSize: 15,
        align: "center",
        });
        // graphics.scale.y = 0.5;
        // const [textX, textY] = screenToIso(1.4 * this.width + 20, -this.height / 2 - 30);
        // text.position.x = textX;
        // text.position.y = textY;

        this.addChild(graphics);
        // this.addChild(text);
        this.optionsVisible = true;
        this.handleCharacterCollision(this);
    }

    showOptions(character) {
        const dx = this.x - character.x;
        const dy = this.y / 2 - character.y / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isCloseEnough = distance < this.width / 1.5 + character.width / 2;

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
