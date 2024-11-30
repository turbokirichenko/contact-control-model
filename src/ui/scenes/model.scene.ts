import { ModelInterface } from "../../entities/model/model.interface";
import { PixiContainer,PixiGraphics, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";

export class ModelScene extends PixiContainer implements SceneInterface {

    private _cowContainer: PixiContainer;
    private _pixiText: PixiText;

    constructor(private readonly _model: ModelInterface) {
        super();
        this.interactive = true;
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this.width = parentWidth;
        this.height = parentHeight;

        const cowRect = new PixiGraphics();
        cowRect
            .rect(-this._model.cow.width/2, -this._model.cow.height/2, this._model.cow.width, this._model.cow.height)
            .fill('blue');
        this._cowContainer = new PixiContainer();
        this._cowContainer.addChild(cowRect);

        this._pixiText = new PixiText({
            text: `cow position: (${this._model.cow.getPosition()!.x}, ${this._model.cow.getPosition()!.y})`,
            style: {
                fontSize: '24px',
                fill: 'red'
            }
        })
        this._pixiText.anchor = 0.5;
        this._pixiText.position.x = parentWidth/2;
        this._pixiText.position.y = parentHeight/2;

        this.addChild(this._cowContainer, this._pixiText);

        _model.setup();
    }

    update(framesPassed: number): void {
        framesPassed = 0;
        this._model.tick();

        this._cowContainer.rotation = this._model.cow.getDirection();
        this._cowContainer.position.x = this._model.cow.getPosition()!.x;
        this._cowContainer.position.y = this._model.cow.getPosition()!.y;

        this._pixiText.text = `cow position: (${this._model.cow.getPosition()!.x.toPrecision(5)}, ${this._model.cow.getPosition()!.y.toPrecision(5)})`;
    }

    resize(parentWidth: number, parentHeight: number): void {

    }
}