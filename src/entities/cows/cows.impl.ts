import { CowInterface } from "../cow/cow.interface";
import { CowsInterface } from "./cows.interface";
import { PopulationImpl } from "../population/population.impl";
import { AgentInterface } from "../agent/agent.interface";
import { Cow } from "../cow";

const INITIAL_NUMBER = 100;

export class Cows extends PopulationImpl<CowInterface> implements CowsInterface, AgentInterface {
    constructor() {
        super(Cow);
        this.initialNumber = INITIAL_NUMBER;
    };
}