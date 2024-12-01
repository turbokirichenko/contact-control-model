import { Vector2d, Vector2dInterface } from "../math/vector2d";
import { ModelInterface } from "../model/model.interface";
import { FarmInterface } from "./farm.interface";

const FARM_DEFAULT_WIDTH = 1000;
const FARM_DEAFULT_HEIGHT = 600;

export class FarmImpl implements FarmInterface {
    public width: number;
    public height: number;
    public position: Vector2dInterface

    constructor() {
        this.position = new Vector2d(0, 0);
        this.width = FARM_DEFAULT_WIDTH;
        this.height = FARM_DEAFULT_HEIGHT;
    }

    tick() {}

    setup(model: ModelInterface) {}
}