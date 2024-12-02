import { IAgent } from "../../plugins/htmodel";
import { Vector2dInterface } from "../math/vector2d";

export interface FarmInterface extends IAgent {
    width: number;
    height: number;
    position: Vector2dInterface;
}