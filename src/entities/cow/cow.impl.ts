import { IModel, IPopulation } from "../../plugins/htmodel";
import { FarmInterface, FARM_TOKEN } from "../farm";
import { Vector2dInterface, Vector2d } from "../math/vector2d";
import { CowInterface } from "./cow.interface";

const COW_DEFAULT_WIDTH = 0.84*2;
const COW_DEFAULT_HEIGHT = 1.96*2;
const COW_DEFAULT_SPEED = 1;
const WAITING_TIME = 60;

export type CowMode = 'move' | 'rest' | 'wait';

export const COW_TOKEN = 'cow';

export class Cow implements CowInterface {
    public width: number;
    public height: number;
    public speed: number;
    public force: number;
    public population?: IPopulation<CowInterface>

    private _farm?: FarmInterface;
    private _position: Vector2dInterface = new Vector2d(0, 0);
    private _destinationPoint: Vector2dInterface = new Vector2d(0, 0);
    private _mode: CowMode = 'rest';
    private _waitingTime: number = WAITING_TIME;
    private _timer: number = 0;

    constructor() {
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
                this._waitingTime = 10 + WAITING_TIME*Math.random()*10;
                this.wait();
            }
        }
    }

    public setup(model: IModel): void {
        var farm = model.getInstance<FarmInterface>(FARM_TOKEN);
        if (!farm) return;
        this._farm = farm;
        var posX = farm.position.x + Math.random()*(farm.width)
        var posY = farm.position.y + Math.random()*(farm.height);
        var vPosX = farm.position.x + Math.random()*(farm.width)
        var vPosY = farm.position.y + Math.random()*(farm.height);
        [this._position.x, this._position.y] = [posX, posY];
        [this._destinationPoint.x, this._destinationPoint.y] = [vPosX, vPosY];
        this.go();
    }

    public stop(): void {
        
    }

    public resume(): void {
        
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

    get isActive() {
        return true;
    }
}