import { AgentInterface } from "../agent/agent.interface";

export interface CowInterface extends AgentInterface {
    width: number;
    height: number;
    speed: number;
    force: number;

    go(): void;
    interrupt(): void;
    wait(): void;
    resume(): void;
    remove(): void;

    getPosition(): { x: number, y: number };
    permanentlyMoveTo(x: number, y: number): void;

    getDestinationPoint(): { x: number, y: number };
    setDestinationPoint(x: number, y: number): void;

    isMoving(): boolean;
    isRemoved(): boolean;
}