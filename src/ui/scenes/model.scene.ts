import { ICow, COW_TOKEN } from "../../entities/cow";
import { IVirus, Virus } from "../../entities/virus";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";
import { PixiContainer,PixiGraphics, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";
import { IModel, IPopulation } from "../../plugins/htmodel";

const X_SCORE = 10;
const X_SCALE = 4;

export class ModelScene extends PixiContainer implements SceneInterface {

    private _cowContainers: PixiContainer[] = [];
    private _text: PixiText = new PixiText({ text: 'time passed: ', style: { fontSize: '24px', fill: 'red' }});
    private secondCounter = 0;
    private _virus?: IPopulation<IVirus<ICow>>;
    private _cows?: IPopulation<ICow>;

    constructor(private readonly _model: IModel) {
        super();
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this.width = parentWidth;
        this.height = parentHeight;

        this._cows = this._model.getInstance<ICow>(COW_TOKEN)!;
        this._virus = this._model.getInstance<IVirus<ICow>>(VIRUS_TOKEN)!;

        if (this._cows) {
            this._cows.forEach(cow => {
                const cowRect = new PixiGraphics();
                cowRect
                    .rect(-cow.width/2*X_SCALE, -cow.height/2*X_SCALE, cow.width*X_SCALE, cow.height*X_SCALE)
                    .fill('brown');
                const cowContainer = new PixiContainer();
                cowContainer.addChild(cowRect);
                this._cowContainers.push(cowContainer);
            });
        }

        if(this._cowContainers.length) {
            this.addChild(...this._cowContainers);
        }

        this._text.position.x = parentWidth/2;
        this._text.position.y = parentHeight/2;
        this._text.anchor = 0.5;
        this.addChild(this._text);
    }

    update(_framesPassed: number): void {
        if (Math.floor(this.secondCounter/(60*60)) >= 12) return;
        for (let i = 0; i < X_SCORE; ++i) {
            this.secondCounter++;
            this._model.tick();
            this._cows?.forEach((cow, index) => {
                const vect = cow.getPosition();
                this._cowContainers[index].position.x = vect.x*X_SCALE;
                this._cowContainers[index].position.y = vect.y*X_SCALE;
                this._cowContainers[index].rotation = cow.getDirection();
            });
        }
        this._text.text = `time passed: ${Math.floor(this.secondCounter/(60*60))} hours, ${Math.floor(this.secondCounter/60%60)} min, ${this._virus?.size}`
    }

    resize(_parentWidth: number, _parentHeight: number): void {}
}