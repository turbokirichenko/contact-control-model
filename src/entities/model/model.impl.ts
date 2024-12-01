import { CowsInterface } from "../cows";
import { CowInterface } from "../cow";
import { FarmInterface } from "../farm";
import { VirusInterface } from "../virus";
import { ModelInterface } from "./model.interface";

export class ModelImpl implements ModelInterface {
    constructor(
        public readonly cows: CowsInterface,
        public readonly farm: FarmInterface,
        public readonly virus: VirusInterface<CowInterface>,
    ) {}

    setup() {
        this.cows.setup(this);
        this.farm.setup(this);
        this.virus.setup(this);
    }

    tick() {
        this.cows.tick();
        this.farm.tick();
        this.virus.tick();
    }
}