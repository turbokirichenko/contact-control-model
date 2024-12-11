import { PixiContainer, PixiGraphics, PixiText } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";
import { IModel } from "../../plugins/htmodel/main";

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
        this._bg.addChild(this._check, this._checkTitle);

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
                        this._queue.push(this._command);
                    }, 10);
                    this._bg.alpha = 0.8;
                } else {
                    this._queue.push(this._command);
                }
            }
        });

        this.addChild(this._bg, this._text);

        this._text.position.x = this._bg.width/2;
        this._text.position.y = this._bg.height/2;
        this._text.anchor = 0.5;
    }
}

export class GUIContainer extends PixiContainer implements SceneInterface {
    private _bg: PixiGraphics;
    private _commandBtns: PixiContainer[] = [];
    constructor(_model: IModel, _queue: (() => void)[]) {
        super();

        this._bg = new PixiGraphics();
        this._bg.rect(0, 0, 400, 800).fill(0x282828);

        _model.actions.forEach((value, _) => {
            var methods = this._getMethods(value);
            methods.map(methodStr => {
                this._commandBtns.push(new CommandBtn(_queue, value[methodStr], value));
            })
        })

        this.addChild(this._bg, ...this._commandBtns);
    }

    update(_framesPassed: number): void {
        
    }

    resize(_screenWidth: number, _screenHeight: number): void {
        this._commandBtns.forEach((btn, index) => {
            var padding = 10;
            btn.position.x = padding;
            btn.position.y = padding + index*btn.height + index*5;
        })
    }

    private _getMethods(value: object) {
        return Object.getOwnPropertyNames(Object.getPrototypeOf(value)).filter(str => (str[0] !== '_' && str !== 'constructor'));
    }
}