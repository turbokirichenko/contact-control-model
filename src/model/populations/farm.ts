import { Vector2d } from "../../plugins/vector2d";
import { IModel } from "../../plugins/htmodel/main";

export const FARMS_TOKEN = 'farms';
const FARM_DEFAULT_WIDTH = 150;
const FARM_DEAFULT_HEIGHT = 150;

export class Farm {
    public width: number;
    public height: number;
    public position: Vector2d;
    constructor(_model: IModel) {
        this.width = _model.globals?.FARM_WIDTH_METERS ?? FARM_DEFAULT_WIDTH;
        this.height = _model.globals?.FARM_HEIGHT_METERS ?? FARM_DEAFULT_HEIGHT;
        this.position = new Vector2d(
            _model.globals?.FARM_POSITION_X ?? 0, 
            _model.globals?.FARM_POSITION_Y ?? 0
        );
    }
}