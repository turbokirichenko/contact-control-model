import { AgentInterface } from "../agent/agent.interface";
import { Vector2dInterface } from "../math/vector2d";

export interface CowInterface extends AgentInterface {
    width: number;
    height: number;
    speed: number;
    force: number;

    go(): void;
    wait(): void;
    interrupt(): void;
    
    getPosition(): Vector2dInterface | null;
    permanentlyMoveTo(x: number, y: number): void;

    getDestinationPoint(): Vector2dInterface | null;
    setDestinationPoint(x: number, y: number): void;
    getDirection(): number;

    isMoving(): boolean;
}