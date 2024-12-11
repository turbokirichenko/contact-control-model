import { Vector2d, Vector2dInterface } from "../../plugins/vector2d";
import { IModel } from "../../plugins/htmodel/main";
import { Farm, FARMS_TOKEN } from "./farm";

export const COWS_TOKEN = 'cows';
type CowMode = 'rest' | 'wait' | 'move';
const COW_DEFAULT_WIDTH = 0.84;
const COW_DEFAULT_HEIGHT = 1.96;
const COW_DEFAULT_SPEED = 2;
const WAITING_TIME = 60*20;

export interface ICow {
    width: number;
    height: number;
    speed: number;
    position: Vector2dInterface;
    targetPoint: Vector2dInterface;
    direction: number;
    tick(): ICow;
}

export class Cow {
    public width: number;
    public height: number;
    public speed: number;
    public position: Vector2dInterface = new Vector2d(0, 0);
    public targetPoint: Vector2dInterface = new Vector2d(0, 0);
    public get direction() {
        return this.position.direction(this.targetPoint);
    }

    private _farm?: Farm;
    private _mode: CowMode = 'rest';
    private _waitingTime: number = WAITING_TIME;
    private _timer: number = 0;

    constructor(_model: IModel) {
        this._farm = _model.use<Farm>(FARMS_TOKEN)?.[0];
        this.width = _model.globals?.COW_WIDTH_METERS ?? COW_DEFAULT_WIDTH;
        this.height =  _model.globals?.COW_HEIGHT_METERS ?? COW_DEFAULT_HEIGHT;
        this.speed = _model.globals?.COW_SPEED ?? COW_DEFAULT_SPEED;
        if (this._farm) {
            var farm = this._farm;
            [this.position.x, this.position.y] = [
                farm.position.x + Math.random()*(farm.width), 
                farm.position.y + Math.random()*(farm.height)
            ];
            [this.targetPoint.x, this.targetPoint.y] = [
                farm.position.x + Math.random()*(farm.width),
                farm.position.y + Math.random()*(farm.height)
            ];
            this._wait();
        }
    }

    public tick(): ICow {
        if (this._mode === 'wait') {
            this._timer++;
            if (this._timer >= this._waitingTime) {
                [this.targetPoint.x, this.targetPoint.y] = this._chooseTargetPoint();
                this._go();
            }
        }
        if (this._mode === 'move') {
            const distance = this.position.calcInterval(this.targetPoint);
            if (distance > this.speed) {
                const deltaVector = this.position.shift(this.targetPoint, this.speed);
                this.position.x -= deltaVector.x;
                this.position.y -= deltaVector.y;
            } else {
                this._wait();
            }
        }
        return this;
    }

    private _go() {
        this._mode = 'move';
    }

    private _wait() {
        this._timer = 0;
        this._waitingTime = WAITING_TIME*Math.random();
        this._mode = 'wait';
    }

    private _chooseTargetPoint(): [number, number] {
        if (this._farm) {
            var posX = this._farm?.position.x + Math.random()*this._farm?.width;
            var posY = this._farm?.position.y + Math.random()*this._farm?.height;
            return [posX, posY];
        }
        return [0, 0];
    }
}