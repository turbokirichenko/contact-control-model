import { Farm } from "../../entities/farm";
import { Cows } from "../../entities/cows";
import { ModelImpl } from "../../entities/model/model.impl";
import { ModelInterface } from "../../entities/model/model.interface";
import { Virus } from "../../entities/virus";

export abstract class ModelFactory {
    static factory(): ModelInterface {
        var farm = new Farm();
        var cows = new Cows();
        var virus = new Virus();
        return new ModelImpl(cows, farm, virus);
    }
}