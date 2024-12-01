import { CowInterface } from "../cow/cow.interface";
import { PopulationImpl } from "../population/population.impl";
import { Cow } from "../cow";

const INITIAL_NUMBER = 0;

export class Virusues extends PopulationImpl<CowInterface> {
    constructor() {
        super(Cow);
        this.initialNumber = INITIAL_NUMBER;
    };
}