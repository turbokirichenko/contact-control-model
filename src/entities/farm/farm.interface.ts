import { AgentInterface } from "../agent/agent.interface";
import { Vector2dInterface } from "../math/vector2d";

export interface FarmInterface extends AgentInterface {
    width: number;
    height: number;
    position: Vector2dInterface;
}