import { ModelInterface } from "../../entities/model/model.interface";
import { PixiContainer,PixiGraphics } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";

export class ModelScene extends PixiContainer implements SceneInterface {

    private _cowContainers: PixiContainer[] = [];

    constructor(private readonly _model: ModelInterface) {
        super();
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this.width = parentWidth;
        this.height = parentHeight;

        this._model.cows.forEach((cow) => {
            const cowRect = new PixiGraphics();
            cowRect
                .rect(-cow.width/2, -cow.height/2, cow.width, cow.height)
                .fill('blue');
            const cowContainer = new PixiContainer();
            cowContainer.addChild(cowRect);
            this._cowContainers.push(cowContainer);
        });

        this.addChild(...this._cowContainers);
    }

    update(framesPassed: number): void {
        framesPassed = 0;
        this._model.tick();

        this._model.cows.forEach((cow, index) => {
            this._cowContainers[index].position.x = cow.getPosition()?.x ?? 0;
            this._cowContainers[index].position.y = cow.getPosition()?.y ?? 0;
            this._cowContainers[index].rotation = cow.getDirection();
        });
    }

    resize(parentWidth: number, parentHeight: number): void {

    }
}