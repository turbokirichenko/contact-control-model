import { CowInterface } from "../cow/cow.interface";
import { CowsInterface } from "./cows.interface";
import { PopulationImpl } from "../population/population.impl";
import { AgentInterface } from "../agent/agent.interface";
import { ModelInterface } from "../model/model.interface";
import { Cow } from "../cow";

const INITIAL_NUMBER = 100;

export class Cows extends PopulationImpl<CowInterface> implements CowsInterface, AgentInterface {
    constructor() {
        super(Cow);
    };

    public setup(model: ModelInterface) {
        for (var i = 0; i < INITIAL_NUMBER; i++) {
            this.add().setup(model);
        }
    };

    public tick() {
        this.forEach((cow) => {
            cow.tick();
        })
    };
}