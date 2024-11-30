import { Vector2d, Vector2dInterface } from "../math/vector2d";
import { CowInterface } from "./cow.interface";

export class CowImpl implements CowInterface {
    public width: number;
    public height: number;
    public speed: number;
    public force: number;

    private _isRemove: boolean = false;

    constructor(
        private _position: Vector2dInterface | null = null,
        private _mode: 'move' | 'rest' | 'wait' = 'rest',
        private _destinationPoint: Vector2dInterface | null = null
    ) {
        this.width = 0.96;
        this.height = 1.86;
        this.speed = 1;
        this.force = Math.random()*1000;
    };

    public tick(): void {
        if (this._mode === 'move' && this._destinationPoint && this._position) {
            const distance = this._position.calcInterval(this._destinationPoint);
            if (distance > 0.1) {
                const deltaVector = this._position.shift(this._destinationPoint, this.speed);
                this._position.x += deltaVector.x;
                this._position.y += deltaVector.y;
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

    public remove(): void {
        this._isRemove = true;
    }

    public getPosition(): Vector2dInterface | null {
        return this._position;
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

    public isRemoved(): boolean {
        return this._isRemove;
    }
}