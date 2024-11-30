import { Vector2d } from ".";
import { Vector2dInterface } from "./vector2d.interface";

export class Vector2dImpl implements Vector2dInterface {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    };
    public calcInterval(vect: Vector2dInterface): number {
        const dX = (this.x - vect.x);
        const dY = (this.y - vect.y);
        return Math.sqrt(dX*dX + dY*dY);
    };
    public shift(vect: Vector2dInterface, multiplex: number = 1): Vector2dInterface {
        var dX = this.x - vect.x;
        var dY = this.y - vect.y;
        return new Vector2d((dX*multiplex)/Math.abs(dX), (dY*multiplex)/Math.abs(dY));
    };
}