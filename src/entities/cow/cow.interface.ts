import { IAgent } from "../../plugins/htmodel";
import { Vector2dInterface } from "../math/vector2d";

export interface ICow extends IAgent {
    uid: number;
    width: number;
    height: number;
    speed: number;
    force: number;

    go(): void;
    wait(): void;
    interrupt(): void;
    
    getPosition(): Vector2dInterface;
    permanentlyMoveTo(x: number, y: number): void;

    getDestinationPoint(): Vector2dInterface | null;
    setDestinationPoint(x: number, y: number): void;
    getDirection(): number;

    isMoving(): boolean;
}