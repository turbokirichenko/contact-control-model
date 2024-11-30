import { FarmInterface } from "../farm";
import { Vector2d, Vector2dInterface } from "../math/vector2d";
import { CowInterface } from "./cow.interface";

const COW_DEFAULT_WIDTH = 0.84;
const COW_DEFAULT_HEIGHT = 1.96;
const COW_DEFAULT_SPEED = 1;

export type CowMode = 'move' | 'rest' | 'wait';

export class CowImpl implements CowInterface {
    public width: number;
    public height: number;
    public speed: number;
    public force: number;
    private _position: Vector2dInterface;
    private _mode: CowMode = 'rest';
    private _destinationPoint: Vector2dInterface;

    constructor(private readonly _farm: FarmInterface) {
        this.width = COW_DEFAULT_WIDTH;
        this.height = COW_DEFAULT_HEIGHT;
        this.speed = COW_DEFAULT_SPEED;
        this.force = Math.random()*1000;

        var posX = _farm.position.x + Math.random()*(this._farm.width)
        var posY = _farm.position.y + Math.random()*(this._farm.height);
        this._position = new Vector2d(posX, posY);

        var vPosX = _farm.position.x + Math.random()*(this._farm.width)
        var vPosY = _farm.position.y + Math.random()*(this._farm.height);
        this._destinationPoint = new Vector2d(vPosX, vPosY);
        console.log(this._destinationPoint.x, this._destinationPoint.y);
    }

    public tick(): void {
        if (this._mode === 'move') {
            const distance = this._position.calcInterval(this._destinationPoint);
            if (distance > 1) {
                const deltaVector = this._position.shift(this._destinationPoint, this.speed);
                this._position.x -= deltaVector.x;
                this._position.y -= deltaVector.y;
            } else {
                this.interrupt();
            }
        }
    }

    public go(): void {
        this._mode = 'move';
    }

    public interrupt(): void {
        this._mode = 'rest';
    }

    public getPosition(): Vector2dInterface | null {
        return this._position;
    }

    public getDirection(): number {
        return this._position.direction(this._destinationPoint);
    }

    public permanentlyMoveTo(x: number, y: number): void {
        this._position = new Vector2d(x, y);
    }

    public getDestinationPoint(): Vector2dInterface | null {
        return this._destinationPoint;
    }

    public setDestinationPoint(x: number, y: number): void {
        this._destinationPoint = new Vector2d(x, y);
    }

    public isMoving(): boolean {
        return this._mode === 'move';
    }
}