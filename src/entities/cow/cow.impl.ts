import { FarmInterface } from "../farm";
import { Vector2dInterface } from "../math/vector2d";
import { PopulationInterface } from "../population/population.interface";
import { CowInterface } from "./cow.interface";

const COW_DEFAULT_WIDTH = 0.84*3;
const COW_DEFAULT_HEIGHT = 1.96*3;
const COW_DEFAULT_SPEED = 1;
const WAITING_TIME = 60*5;

export type CowMode = 'move' | 'rest' | 'wait';

export class CowImpl implements CowInterface {
    public width: number;
    public height: number;
    public speed: number;
    public force: number;
    public population?: PopulationInterface<CowInterface> | undefined;

    private _mode: CowMode = 'rest';
    private _waitingTime: number = WAITING_TIME;
    private _timer: number = 0;

    constructor(
        private readonly _farm: FarmInterface,
        private _position: Vector2dInterface,
        private _destinationPoint: Vector2dInterface
    ) {
        this.width = COW_DEFAULT_WIDTH;
        this.height = COW_DEFAULT_HEIGHT;
        this.speed = COW_DEFAULT_SPEED;
        this.force = Math.random()*1000;
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
            if (distance > 1) {
                const deltaVector = this._position.shift(this._destinationPoint, this.speed);
                this._position.x -= deltaVector.x;
                this._position.y -= deltaVector.y;
            } else {
                this._timer = 0;
                this.wait();
            }
        }
    }

    public go(): void {
        this._mode = 'move';
    }

    public wait(): void {
        this._mode = 'wait';
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
        var posX = this._farm.position.x + Math.random()*this._farm.width;
        var posY = this._farm.position.y + Math.random()*this._farm.height;
        return [posX, posY];
    }
}