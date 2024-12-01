import { CowsInterface } from "../cows/cows.interface";
import { FarmInterface } from "../farm";
import { ModelInterface } from "./model.interface";

export class ModelImpl implements ModelInterface {
    constructor(
        public readonly cows: CowsInterface,
        public readonly farm: FarmInterface,
    ) {}

    setup() {
        this.cows.setup(this);
    }

    tick() {
        this.cows.tick();
        this.farm.tick();
    }
}