import { Farm } from "../../entities/farm";
import { Cows } from "../../entities/cows";
import { ModelImpl } from "../../entities/model/model.impl";
import { ModelInterface } from "../../entities/model/model.interface";

export abstract class ModelFactory {
    static factory(): ModelInterface {
        var farm = new Farm();
        var cows = new Cows();
        return new ModelImpl(cows, farm);
    }
}