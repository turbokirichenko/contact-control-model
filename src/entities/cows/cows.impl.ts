import { CowInterface } from "../cow/cow.interface";
import { CowsInterface } from "./cows.interface";
import { PopulationImpl } from "../population/population.impl";

export class Cows extends PopulationImpl implements CowsInterface {
    constructor(agents?: CowInterface[]) {
        super(agents || []);
    };
}