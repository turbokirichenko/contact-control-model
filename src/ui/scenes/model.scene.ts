import { CowInterface, COW_TOKEN } from "../../entities/cow";
import { Virus } from "../../entities/virus";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";
import { PixiContainer,PixiGraphics, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";
import { IModel, IPopulation } from "../../plugins/htmodel";

const X_SCORE = 20;

export class ModelScene extends PixiContainer implements SceneInterface {

    private _cowContainers: PixiContainer[] = [];
    private _text: PixiText = new PixiText({ text: 'time passed: ', style: { fontSize: '24px', fill: 'red' }});
    private _virusContainers: Map<number, PixiContainer> = new Map();
    private secondCounter = 0;
    private _virus?: Virus;
    private _cows?: IPopulation<CowInterface>;

    constructor(private readonly _model: IModel) {
        super();
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this.width = parentWidth;
        this.height = parentHeight;

        this._cows = this._model.getPopulation(COW_TOKEN)! as IPopulation<CowInterface>;
        this._virus = this._model.getInstance<Virus>(VIRUS_TOKEN)! as Virus;

        if (this._cows) {
            console.log(this._cows)
            this._cows.forEach(cow => {
                console.log('1')
                const cowRect = new PixiGraphics();
                cowRect
                    .rect(-cow.width/2, -cow.height/2, cow.width, cow.height)
                    .fill('brown');
                const cowContainer = new PixiContainer();
                cowContainer.addChild(cowRect);
                this._cowContainers.push(cowContainer);
            });
        }

        if(this._cowContainers.length) {
            console.log('added')
            this.addChild(...this._cowContainers);
        }

        this._text.position.x = parentWidth/2;
        this._text.position.y = parentHeight/2;
        this._text.anchor = 0.5;
        this.addChild(this._text);
    }

    update(_framesPassed: number): void {
        if (Math.floor(this.secondCounter/(60*60)) >= 12) return;
        console.log('ok');
        for (let i = 0; i < X_SCORE; ++i) {
            this.secondCounter++;
            this._model.tick();
            this._cows?.forEach((cow, index) => {
                const vect = cow.getPosition();
                this._cowContainers[index].position.x = vect.x;
                this._cowContainers[index].position.y = vect.y;
                this._cowContainers[index].rotation = cow.getDirection();
            })
            this._virus?.infected.forEach((_, key) => {
                if (!this._virusContainers.has(key)) {
                    const greenCircle = new PixiGraphics();
                    greenCircle
                        .circle(
                            0, 
                            0, 
                            this._virus?.infectionRadius ?? 0
                        )
                        .fill('green');
                    greenCircle.alpha = 0.5;
                    const container = new PixiContainer().addChild(greenCircle);
                    this._virusContainers.set(key, container);
                    this.addChild(container);
                }
            });
            this._virusContainers.forEach((virus, key) => {
                const vect = this._cows?.[key]?.getPosition();
                virus.position.x = vect?.x ?? 0;
                virus.position.y = vect?.y ?? 0;
            });
        }

        this._text.text = `time passed: ${Math.floor(this.secondCounter/(60*60))} hours, ${Math.floor(this.secondCounter/60%60)} min`
    }

    resize(_parentWidth: number, _parentHeight: number): void {}
}