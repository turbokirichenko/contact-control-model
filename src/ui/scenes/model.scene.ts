import { ModelInterface } from "../../entities/model/model.interface";
import { PixiContainer,PixiGraphics } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";

const X_SCORE = 10;

export class ModelScene extends PixiContainer implements SceneInterface {

    private _cowContainers: PixiContainer[] = [];
    private _virusContainers: Map<number, PixiContainer> = new Map();

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
                .fill('brown');
            const cowContainer = new PixiContainer();
            cowContainer.addChild(cowRect);
            this._cowContainers.push(cowContainer);
        });

        if(this._cowContainers.length) {
            this.addChild(...this._cowContainers);
        }
    }

    update(framesPassed: number): void {
        for (let i = 0; i < X_SCORE; ++i) {
            this._model.tick();

            this._model.cows.forEach((cow, index) => {
                const vect = cow.getPosition();
                this._cowContainers[index].position.x = vect.x;
                this._cowContainers[index].position.y = vect.y;
                this._cowContainers[index].rotation = cow.getDirection();
            });
            if (this._model.virus.infected.size && this._model.virus.infected.size < 30) {
                this._model.virus.infected.forEach((infects, key) => {
                    if (!this._virusContainers.has(key)) {
                        const greenCircle = new PixiGraphics();
                        greenCircle
                            .circle(
                                infects.width/2, 
                                infects.height/2, 
                                this._model.virus.infectionRadius
                            )
                            .fill('green');
                        greenCircle.alpha = 0.5;
                        const container = new PixiContainer().addChild(greenCircle);
                        this._virusContainers.set(key, container);
                        this.addChild(container);
                    }
                });
            }
            this._virusContainers.forEach((virus, key) => {
                const vect = this._model.cows[key]?.getPosition();
                virus.position.x = vect.x;
                virus.position.y = vect.y;
            });
        }   
    }

    resize(parentWidth: number, parentHeight: number): void {

    }
}