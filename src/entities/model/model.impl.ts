import { Cow } from "../cow";
import { Farm } from "../farm";
import { ModelInterface } from "./model.interface";

export class ModelImpl implements ModelInterface {
    constructor(
        public readonly cow: Cow,
        public readonly farm: Farm,
    ) {}

    setup() {
        this.cow.go();
    }

    tick() {
        this.cow.tick();
        this.farm.tick();
    }
}