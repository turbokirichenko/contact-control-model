import { FederatedPointerEvent } from "pixi.js";
import { PixiContainer, PixiGraphics, PixiText } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";
import { IModel, IPopulation } from "../../plugins/htmodel/main";
import { SCENE_CONFIG } from "../scenes/example.scene";

class ScrollScaleBar extends PixiContainer implements SceneInterface {
    private _scrollPoint: PixiGraphics;
    private _scrollPosition: number = 0;
    private _bg: PixiGraphics;
    private _scrollLine: PixiGraphics;
    private _target: PixiGraphics | null;
    private _scalePoint: number;

    constructor() {
        super();
        this._target = null;
        this._scalePoint = 0;
        this._bg = new PixiGraphics();
        this._bg
            .rect(0, 0, 200, 60)
            .fill('black');
        this._bg.alpha = 0;
        this._scrollPoint = new PixiGraphics();
        this._scrollPoint
            .circle(0, 0, 10)
            .fill(0xfdf4e3);
        this._scrollLine = new PixiGraphics();
        this._scrollLine
            .rect(0, 0, 180, 2.5)
            .fill(0xfdf4e3);
        this._scrollLine.alpha = 0.25;
        
        this._bg.interactive = true;
        this._bg.on('pointerdown', () => { 
            if (!this._target) {
                this._target = this._scrollPoint;
                this._scrollPoint.alpha = 0.9;
            }
        })
        this._bg.on('pointermove', (event: FederatedPointerEvent) => {
            console.log('move');
            if (this._target) {
                var x = this._target.x;
                if (Math.abs(this._target.position.x + event.movementX) < (this._scrollLine.width/2 - 10)) {
                    this._scrollPosition = x + event.movementX;
                    this._target.position.set(Math.floor(this._scrollPosition), 0);
                    this._scalePoint += event.movementX;
                    SCENE_CONFIG.SCALE = (1 + (Math.abs(this._scalePoint + this._bg.width/2)/this._bg.width*8));
                }
            }
        });
        this._bg.on('pointerup', () => {
            this._target = null;
            this._scrollPoint.alpha = 1;
        });
        this._bg.on('pointerupoutside', () => {
            this._target = null;
            this._scrollPoint.alpha = 1;
        });
        
        this.addChild( this._scrollLine, this._scrollPoint, this._bg);
        this._bg.position.set(-this._bg.width/2, -this._bg.height/2);
        this._scrollLine.position.set(-this._scrollLine.width/2, 0);
        this._scrollPoint.position.set(0, 0);
    }

    update () {
    }

    resize (_w: number, _h: number) {
        
    }
}

class PopulationBar extends PixiContainer implements SceneInterface {
    private _population?: IPopulation<any>;
    private _populationTitleBg: PixiGraphics;
    private _populationTitle: PixiText;
    private _sizeTitle: PixiText;

    constructor(private _name: string, private readonly _model: IModel) {
        super();
        this._population = this._model.use(_name);
        this._populationTitleBg = new PixiGraphics();
        this._populationTitleBg
            .rect(0, 0, 370, 30)
            .fill(0xfdf4e3);
        this._populationTitle = new PixiText({ text: _name, style: {
            fontSize: 20,
            fontWeight: 'bold',
            fill: 'black'
        }});
        this._sizeTitle = new PixiText({ text: `size: ${this._population?.size ?? 0}`, style: {
            fontSize: 16,
            fontWeight: 'bold',
            fill: 0xfdf4e3,
        }});
        this._populationTitle.position.set(185, 15);
        this._populationTitle.anchor.set(0.5);
        this._sizeTitle.position.set(0, 45);
        this._sizeTitle.anchor.set(0, 0.5);
        this.addChild(this._populationTitleBg, this._populationTitle, this._sizeTitle);
    }

    resize(_screenWidth: number, _screenHeight: number): void {}

    update(_framesPassed: number) {
        this._sizeTitle.text = `size: ${this._model.use(this._name)?.size ?? 0}`;
    }
}

class CommandBtn extends PixiContainer {
    private _run: number | null;
    private _isInfinity: boolean = false;
    private _bg: PixiGraphics;
    private _check: PixiGraphics;
    private _checkTitle: PixiText;
    private _text: PixiText;
    private _command: () => void;
    constructor(private readonly _queue: (() => void)[], _command: () => void, ctx: any) {
        super();
        this._run = null;
        this._command = _command.bind(ctx);
        this._text = new PixiText({ text: this._command.name.toUpperCase().replace('BOUND ', ''), style: { fontSize: '18px', fontFamily: 'Arial', fontWeight: 'bold', fill: 'black' }});
        this._bg = new PixiGraphics();
        this._bg.rect(0, 0, 180, 80).fill(0xfdf4e3);
        this._check = new PixiGraphics();
        this._check
            .rect(5, 60, 15, 15)
            .stroke({ width: 2, color: 0xfeeb77 })
            .fill(this._isInfinity ? 'black' : 'white');
        this._checkTitle = new PixiText({ text: 'infininty', style: { fontSize: '12px', fontFamily: 'Arial', fill: 'gray' }});
        this._checkTitle.position.set(30, 67);
        this._checkTitle.anchor.set(0, 0.5);

        this._check.interactive = true;
        this._check.on('pointerup', (event) => {
            this._isInfinity = !this._isInfinity;
            this._check.clear();
            this._check
                .rect(5, 60, 15, 15)
                .stroke({ width: 2, color: 0xfeeb77 })
                .fill(this._isInfinity ? 'black' : 'white');
            event.stopPropagation();
        })

        this.interactive = true;
        this.on('pointerup', () => {
            if (this._run) {
                clearInterval(this._run);
                this._bg.alpha = 1;
                this._run = null;
            } else {
                if (this._isInfinity) {
                    this._run = setInterval(() => {
                        for (let i = 0; i < SCENE_CONFIG.SPEED; ++i) {
                            this._queue.push(this._command);
                        }
                    }, 10);
                    this._bg.alpha = 0.8;
                } else {
                    this._queue.push(this._command);
                }
            }
        });

        this.addChild(this._bg, this._check, this._checkTitle, this._text);

        this._text.position.x = this._bg.width/2;
        this._text.position.y = this._bg.height/2;
        this._text.anchor = 0.5;
    }
}

export class ModelPanel extends PixiContainer implements SceneInterface {
    private _btnSpeedPlus: PixiGraphics;
    private _btnSpeedMinus: PixiGraphics;
    private _globals: PixiText;
    private _modelTitle: PixiText;
    private _speedTitle: PixiText;
    private _scrollScaleBar: ScrollScaleBar;
    constructor(private readonly _model: IModel) {
        super();
        this._modelTitle = new PixiText({ text: `Model`, style: {
            fontSize: 28,
            fontWeight: 'bold',
            fill: 0xfdf4e3,
        }});
        this._speedTitle = new PixiText({ text: `speed: x${SCENE_CONFIG.SPEED}\nscale: 1m:${SCENE_CONFIG.SCALE.toFixed(2)}px`, style: {
            fontSize: 11,
            fontWeight: 'bold',
            fill: 0xfdf4e3,
        }});
        this._speedTitle.anchor.set(0.5);
        var text: string[] = [];
        Object.keys(this._model.globals ?? {}).forEach((key: string) => {
            text.push(`${key}: ${String(this._model.globals?.[key])}\n`);
        });
        this._globals = new PixiText({text: text.join(''), style: {
            fontSize: 12,
            lineHeight: 18,
            fontWeight: 'bold',
            fill: 0xfdf4e3,
        }});
        this._btnSpeedPlus = new PixiGraphics();
        this._btnSpeedPlus.poly([{x: 0, y: 0}, {x: 30, y: 15}, {x: 30, y: -15}]).fill(0xfdf4e3);
        this._btnSpeedMinus = new PixiGraphics();
        this._btnSpeedMinus.poly([{x: 0, y: 0}, {x: -30, y: 15}, {x: -30, y: -15}]).fill(0xfdf4e3);
        this._btnSpeedPlus.interactive = true;
        this._btnSpeedPlus.on('pointerup', () => {
            if (SCENE_CONFIG.SPEED >= 2) SCENE_CONFIG.SPEED = Math.floor(SCENE_CONFIG.SPEED/2);
            this._speedTitle.text = `speed: x${SCENE_CONFIG.SPEED}\nscale: 1m:${SCENE_CONFIG.SCALE.toFixed(2)}px`;
        });
        this._btnSpeedMinus.interactive = true;
        this._btnSpeedMinus.on('pointerup', () => {
            if (!SCENE_CONFIG.SPEED) SCENE_CONFIG.SPEED += 1;
            if (SCENE_CONFIG.SPEED < 63) SCENE_CONFIG.SPEED*=2;
            this._speedTitle.text = `speed: x${SCENE_CONFIG.SPEED}\nscale: 1m:${SCENE_CONFIG.SCALE.toFixed(2)}px`;
        });

        this._scrollScaleBar = new ScrollScaleBar();
        this.addChild(
            this._btnSpeedMinus,
            this._btnSpeedPlus,
            this._globals,
            this._speedTitle,
            this._scrollScaleBar,
            this._modelTitle
        )
    }

    update(_framesPassed: number): void {
        
    }

    resize(_screenWidth: number, _screenHeight: number): void {
        var gap = 5;
        this._modelTitle.position.x = 0;
        this._modelTitle.position.y = 0;

        this._globals.position.x = 0;
        this._globals.position.y = this._modelTitle.height + gap;

        this._btnSpeedPlus.position.set(0, this._modelTitle.height + this._globals.height + 2*gap);
        this._btnSpeedMinus.position.set(160, this._modelTitle.height + this._globals.height + 2*gap);
        this._speedTitle.position.set(80, this._modelTitle.height + this._globals.height + 2*gap);

        this._scrollScaleBar.resize(_screenWidth, _screenHeight);
        this._scrollScaleBar.position.set(280, this._modelTitle.height + this._globals.height + 2*gap);
    };
}

export class GUIContainer extends PixiContainer implements SceneInterface {
    private _bg: PixiGraphics;
    private _modelPanel: ModelPanel;
    private _populations: PopulationBar[] = [];
    private _commandBtns: PixiContainer[] = [];
    constructor(_model: IModel, _queue: (() => void)[]) {
        super();

        this._bg = new PixiGraphics();
        this._bg.rect(0, 0, 400, 800).fill(0x282828);

        this._modelPanel = new ModelPanel(_model);

        _model.populations.forEach((_, name) => {
            this._populations.push(new PopulationBar(name, _model))
        })

        _model.actions.forEach((value, _) => {
            var methods = this._getMethods(value);
            methods.map(methodStr => {
                this._commandBtns.push(new CommandBtn(_queue, value[methodStr], value));
            })
        })

        this.addChild(this._bg, this._modelPanel, ...this._commandBtns, ...this._populations);
    }

    update(_framesPassed: number): void {
        this._populations.forEach(target => {
            target.update(_framesPassed);
        });
    }

    resize(_screenWidth: number, _screenHeight: number): void {
        var padding = 10;
        var gap = 10;
        var prevheight = 0;
        this._modelPanel.resize(_screenWidth, _screenHeight);
        this._modelPanel.position.set(padding, padding);
        prevheight += this._modelPanel.height + gap;
        this._populations.forEach((line, index) => {
            line.position.x = padding;
            line.position.y = this._modelPanel.height + gap + padding + index*(line.height + gap);
            prevheight += (line.height + gap);
        });
        this._commandBtns.forEach((btn, index) => {
            if ((index+1)%2) {
                var shift = index/2;
                btn.position.x = padding;
                btn.position.y = prevheight + padding + shift*btn.height + shift*gap;
            } else {
                var shift = Math.floor(index/2);
                btn.position.x = padding + btn.width + gap;
                btn.position.y = prevheight + padding + shift*btn.height + shift*gap;
            }
        })
    }

    private _getMethods(value: object) {
        return Object.getOwnPropertyNames(Object.getPrototypeOf(value)).filter(str => (str[0] !== '_' && str !== 'constructor'));
    }
}