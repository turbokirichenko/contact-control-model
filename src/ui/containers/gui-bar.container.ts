import { PixiContainer, PixiGraphics } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";

const DEFAULT_WIDTH = 280;
const DEFAULT_HEIGHT = 800;
const DEFAULT_FILL = 0xb9b9b9;

export class GUIBarContainer extends PixiContainer implements SceneInterface {
    private _graphic: PixiGraphics;

    constructor() {
        super();
        this._graphic = new PixiGraphics();
        this._graphic
            .rect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT)
            .fill(DEFAULT_FILL);
        this.addChild(this._graphic);
    }   

    update(framePassed: number): void {}

    resize(_: number, parentHeight: number) {
        this._graphic.width = DEFAULT_WIDTH;
        this._graphic.height = parentHeight;
    }
}