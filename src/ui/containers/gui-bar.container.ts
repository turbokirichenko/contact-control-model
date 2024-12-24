import { PixiContainer, PixiGraphics, PixiText } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";
import { IAgent, IModel, IPopulation } from "../../plugins/htmodel";
import { X } from "../scenes/model.scene";

const DEFAULT_WIDTH = 280;
const DEFAULT_HEIGHT = 800;
const DEFAULT_FILL = 0xb9b9b9;

export class PopulationBarContainer extends PixiContainer implements SceneInterface {
    private _bg;
    private _title;
    private _addBtn;
    private _addBtnText;
    private _rmBtn;
    private _rmBtnText;
    constructor(private readonly _name: string, private readonly _population: IPopulation<IAgent>) {
        super();
        this._bg = new PixiGraphics();
        this._bg.rect(0, 0, 270, 90);
        this._bg.fill(0xc9c9c9);

        this._addBtnText = new PixiText({ text: '+', style: { fontSize: '24px' } });
        this._addBtnText.anchor.set(0.5);
        this._addBtn = new PixiGraphics();
        this._addBtn.rect(0, 0, 30, 30);
        this._addBtn.fill('white');
        this._addBtn.interactive = true;
        this._addBtn.on('pointerup', () => {
            this._population.add();
        });
        this._addBtnText.interactive = true;
        this._addBtnText.on('pointerup', () => {
            this._population.add();
        });

        this._rmBtnText = new PixiText({ text: '-', style: { fontSize: '24px' } });
        this._rmBtnText.anchor.set(0.5);
        this._rmBtn = new PixiGraphics();
        this._rmBtn.rect(0, 0, 30, 30);
        this._rmBtn.fill('white');
        this._rmBtn.interactive = true;
        this._rmBtn.on('pointerup', () => {
            this._population.remove(this._population.size - 1);
        });
        this._rmBtnText.interactive = true;
        this._rmBtnText.on('pointerup', () => {
            this._population.remove(this._population.size - 1);
        });

        this._title = new PixiText({ text: `${this._name}`, style: {
            fontSize: '24px',
            fill: 0x372388
        }});

        this.addChild(this._bg, this._title, this._addBtn, this._addBtnText, this._rmBtn, this._rmBtnText);
    }  

    update(_framesPassed: number): void {
        
    }

    resize(_screenWidth: number, _screenHeight: number): void {
        var padding = 12;
        this._title.position.x = 5;
        this._title.position.y = 5;
        this._addBtn.position.x = this.width - padding - 30;
        this._addBtn.position.y = 5;
        this._addBtnText.position.x = this.width - padding - 30/2;
        this._addBtnText.position.y = 5 + 30/2;

        this._rmBtn.position.x = this.width - padding + 4 - 30;
        this._rmBtn.position.y = 5 + 50;
        this._rmBtnText.position.x = this.width - padding + 4 - 30/2;
        this._rmBtnText.position.y = 5 + 30/2 + 50;
    }
}

export class GUIBarContainer extends PixiContainer implements SceneInterface {
    private _secondCounter = 0;
    private _graphic: PixiGraphics;
    private _text: PixiText;
    private _modelTitle: PixiText;
    private _time: PixiText = new PixiText({ text: 'time passed: ', style: { fontSize: '14px', fill: 'red' }});
    private _modelInfo: PixiText
    private _populationContainers: PopulationBarContainer[];
    private _speedLBtn: PixiGraphics;
    private _speedMBtn: PixiGraphics;
    private _speed: PixiText;

    constructor(private readonly _model: IModel) {
        super();
        this._graphic = new PixiGraphics();
        this._text = new PixiText({ text: '', style: { fontSize: '24px', fill: 0x372388 } });
        this._modelTitle = new PixiText({ text: 'Model', style: { fontSize: '24px', fill: 0x372388 }  });
        const text: string[] = [];
        this._populationContainers = [];
        this._model.instances.forEach((value, token) => {
            this._populationContainers.push(new PopulationBarContainer(token, value));
            text.push(`${token} size: ${value.size}\n`);
        })
        this._modelInfo = new PixiText({
            text: text.join(''),
            style: {
                fontSize: '16px',
                fill: 0x372388,
            }
        })
        this._speed = new PixiText({ text: 'speed: ', style: { fontSize: '16px', fill: 0x372388 }});
        this._speed.text = `speed: x${X.SCORE}\nscale: 1m=${X.SCALE}px`
        this._speedLBtn = new PixiGraphics();
        this._speedLBtn.poly([{x: 0, y: 0}, {x: 30, y: 15}, {x: 30, y: -15}]).fill('white');
        this._speedMBtn = new PixiGraphics();
        this._speedMBtn.poly([{x: 0, y: 0}, {x: -30, y: 15}, {x: -30, y: -15}]).fill('white');
        this._speedLBtn.interactive = true;
        this._speedLBtn.on('pointerup', () => {
            if (X.SCORE) X.SCORE = Math.floor(X.SCORE/2);
            this._speed.text = `speed: x${X.SCORE}\nscale: 1m=${X.SCALE}px`
        })
        this._speedMBtn.interactive = true;
        this._speedMBtn.on('pointerup', () => {
            if (!X.SCORE) X.SCORE += 1;
            if (X.SCORE < 63) X.SCORE*=2;
            this._speed.text = `speed: x${X.SCORE}\nscale: 1m=${X.SCALE}px`
        })
        this._graphic
            .rect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT)
            .fill(DEFAULT_FILL);
        this.addChild(this._graphic, this._text, this._modelTitle, this._modelInfo, this._time, ...this._populationContainers, this._speed, this._speedLBtn, this._speedMBtn);
    }

    update(_framePassed: number): void {
        const text: string[] = [];
        this._model.instances.forEach((value, token) => {
            this._populationContainers.push(new PopulationBarContainer(token, value));
            text.push(`${token} size: ${value.size}\n`);
        })
        this._modelInfo.text = text.join('');
        this._secondCounter++;
        this._time.text = `TIME: ${Math.floor(this._secondCounter/(24*60*60))} days ${Math.floor(this._secondCounter/(60*60)%24)}:${Math.floor(this._secondCounter/60%60)}:${Math.floor(this._secondCounter%60)}`
    }

    resize(_: number, parentHeight: number) {
        this._modelTitle.position.x = 5;
        this._modelTitle.position.y = 5;
        this._modelInfo.position.x = 5;
        this._modelInfo.position.y = 48;
        this._time.position.x = 5
        this._time.position.y = 30;
        this._graphic.width = DEFAULT_WIDTH;
        this._graphic.height = parentHeight + 100;

        this._speedLBtn.position.x = 5;
        this._speedLBtn.position.y = 145;
        this._speedMBtn.position.x = 95;
        this._speedMBtn.position.y = 145;

        this._speed.position.x = 120;
        this._speed.position.y = 124;

        this._populationContainers.map((cont, index) => {
            cont.position.x = 5;
            cont.position.y = cont.height*index + 165;
            cont.resize(_, parentHeight);
        })
    }
}