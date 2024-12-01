import { ModelInterface } from "../../entities/model/model.interface";
import { PixiContainer,PixiGraphics, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";

const X_SCORE = 10;

export class ModelScene extends PixiContainer implements SceneInterface {

    private _cowContainers: PixiContainer[] = [];
    private _virusContainers: Map<number, PixiContainer> = new Map();
    private _text: PixiText = new PixiText({ text: 'time passed: ', style: { fontSize: '24px', fill: 'red' }});
    private secondCounter = 0;

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

        this._text.position.x = parentWidth/2;
        this._text.position.y = parentHeight/2;
        this._text.anchor = 0.5;
        this.addChild(this._text);
    }

    update(framesPassed: number): void {
        if (Math.floor(this.secondCounter/(60*60)) >= 12) return;
        for (let i = 0; i < X_SCORE; ++i) {
            this.secondCounter++;
            this._model.tick();

            this._model.cows.forEach((cow, index) => {
                const vect = cow.getPosition();
                this._cowContainers[index].position.x = vect.x;
                this._cowContainers[index].position.y = vect.y;
                this._cowContainers[index].rotation = cow.getDirection();
            });

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

            this._virusContainers.forEach((virus, key) => {
                const vect = this._model.cows[key]?.getPosition();
                virus.position.x = vect.x;
                virus.position.y = vect.y;
            });
        }

        this._text.text = `time passed: ${Math.floor(this.secondCounter/(60*60))} hours, ${Math.floor(this.secondCounter/60%60)} min`
    }

    resize(parentWidth: number, parentHeight: number): void {

    }
}