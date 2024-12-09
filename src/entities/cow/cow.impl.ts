import { IModel } from "../../plugins/htmodel";
import { IFarm, FARM_TOKEN } from "../farm";
import { Vector2dInterface, Vector2d } from "../math/vector2d";
import { ICow } from "./cow.interface";

const COW_DEFAULT_WIDTH = 0.84;
const COW_DEFAULT_HEIGHT = 1.96;
const COW_DEFAULT_SPEED = 2;
const WAITING_TIME = 60*20;

export type CowMode = 'move' | 'rest' | 'wait';

export const COW_TOKEN = 'cow';

export class Cow implements ICow {
    private static count = 0;
    public readonly uid: number;
    public width: number;
    public height: number;
    public speed: number;
    public force: number;

    private _farm?: IFarm;
    private _position: Vector2dInterface = new Vector2d(0, 0);
    private _destinationPoint: Vector2dInterface = new Vector2d(0, 0);
    private _mode: CowMode = 'rest';
    private _waitingTime: number = WAITING_TIME;
    private _timer: number = 0;

    constructor(private readonly _model: IModel) {
        this.uid = Cow.count++;
        this._farm = this._model.getOne<IFarm>(FARM_TOKEN);
        this.width = COW_DEFAULT_WIDTH;
        this.height = COW_DEFAULT_HEIGHT;
        this.speed = COW_DEFAULT_SPEED;
        this.force = Math.random()*1000;
        if (this._farm) {
            var farm = this._farm;
            var posX = farm.position.x + Math.random()*(farm.width)
            var posY = farm.position.y + Math.random()*(farm.height);
            var vPosX = farm.position.x + Math.random()*(farm.width)
            var vPosY = farm.position.y + Math.random()*(farm.height);
            [this._position.x, this._position.y] = [posX, posY];
            [this._destinationPoint.x, this._destinationPoint.y] = [vPosX, vPosY];
            this.wait();
        }
    }

    public tick(): void {
        if (this._mode === 'wait') {
            this._timer++;
            if (this._timer >= this._waitingTime) {
                [this._destinationPoint.x, this._destinationPoint.y] = this.generateDestinationPoint();
                this.go();
            }
        }
        if (this._mode === 'move') {
            const distance = this._position.calcInterval(this._destinationPoint);
            if (distance > this.speed) {
                const deltaVector = this._position.shift(this._destinationPoint, this.speed);
                this._position.x -= deltaVector.x;
                this._position.y -= deltaVector.y;
            } else {
                this.wait();
            }
        }
    }

    public go(): void {
        this._mode = 'move';
    }

    public wait(): void {
        this._timer = 0;
        this._waitingTime = WAITING_TIME*Math.random();
        this._mode = 'wait';
    }

    public interrupt(): void {
        this._mode = 'rest';
    }

    public getPosition(): Vector2dInterface {
        return this._position;
    }

    public getDirection(): number {
        return this._position.direction(this._destinationPoint);
    }

    public permanentlyMoveTo(x: number, y: number): void {
        this._position.x = x;
        this._position.y = y;
    }

    public getDestinationPoint(): Vector2dInterface | null {
        return this._destinationPoint;
    }

    public setDestinationPoint(x: number, y: number): void {
        this._destinationPoint.x = x;
        this._destinationPoint.y = y;
    }

    public isMoving(): boolean {
        return this._mode === 'move';
    }

    private generateDestinationPoint(): [number, number] {
        if (this._farm) {
            var posX = this._farm?.position.x + Math.random()*this._farm?.width;
            var posY = this._farm?.position.y + Math.random()*this._farm?.height;
            return [posX, posY];
        }
        return [0, 0];
    }
}