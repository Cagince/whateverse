import { Rooms } from './constants/rooms';
import { screenToIso } from './utils';

const PIXI = global.PIXI;

function calcHypotenuse(a, b) {
    return (Math.sqrt((a * a) + (b * b)));
}

export default class Building extends PIXI.Sprite {
    constructor(name, texture, x, y, data, handleCharacterCollision) {
        super(texture);

        this.convertTo2d();
        this.proj.affine = PIXI.projection.AFFINE.AXIS_X;

        this.anchor.set(0.5, 1.0);
        this.scale.set(0.3);

        this.x = x;
        this.y = y;
        this.data = data;
        this.radius = this.width / 2.3;
        this.name = name;
        // this.optionsVisible = false;
        this.handleCharacterCollision = handleCharacterCollision;
        
        this.buttonMode = true;
        this.interactive = true;

        this
            // events for drag start
            .on('mousedown', this.onDragStart)
            .on('touchstart', this.onDragStart)
            // events for drag end
            .on('mouseup', this.onDragEnd)
            .on('mouseupoutside', this.onDragEnd)
            .on('touchend', this.onDragEnd)
            .on('touchendoutside', this.onDragEnd)
            // events for drag move
            .on('mousemove', this.onDragMove)
            .on('touchmove', this.onDragMove);
    }

    onDragStart(event)
    {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }
    
    onDragEnd()
    {
        this.alpha = 1;
    
        this.dragging = false;
    
        // set the interaction data to null
        this.data = null;

        console.log(`[${this.x}, ${this.y}]`);
    }
    
    onDragMove()
    {
        if (this.dragging)
        {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.position.x = newPosition.x;
            this.position.y = newPosition.y;
        }
    }

    addCircle(r) {
        const graphics = new PIXI.Graphics();
        graphics.scale.y = 0.5;
        graphics.lineStyle(2, 0xff247c, 1);

        graphics.drawCircle(
            0, 0, 5
        )
        console.log(r)

        graphics.drawCircle(
            ...screenToIso(this.width, -this.height / 2),
            r * 2
        );
        console.log(r);

        graphics.endFill();
        // const text = new PIXI.Text(this.name, {
        //     fill: 0xff247c,
        //     fontSize: 15,
        //     align: "center",
        // });
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
        const distance = calcHypotenuse(dx, dy);
        const h = calcHypotenuse(this.width, this.width / 2);
        const isCloseEnough = distance < 100;

        if (isCloseEnough && !this.optionsVisible) {
            this.addCircle(h);
            return;
        }

        if (!isCloseEnough && this.optionsVisible) {
        this.removeChildren(0);
        this.optionsVisible = false;
        }
    }
}
