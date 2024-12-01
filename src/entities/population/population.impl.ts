import { AgentInterface } from "../agent/agent.interface";
import { ModelInterface } from "../model/model.interface";
import { PopulationInterface } from "./population.interface";

const DEFAULT_INITIAL_NUMBER = 100;

export class PopulationImpl<T extends AgentInterface> extends Array implements PopulationInterface<T> {

    public initialNumber: number = DEFAULT_INITIAL_NUMBER;

    constructor(private constr: { new(...args: any[]): T }) {
        super();
    }

    tick() {
        this.forEach(agent => {
            agent.tick();
        })
    }

    public setup(model: ModelInterface) {
        for (var i = 0; i < this.initialNumber; i++) {
            this.add().setup(model);
        }
    };

    push(agent: T) {
        if (agent.population) {
            throw new Error('Impossible to set population to the agent that already in any population');
        }
        agent.population = this;
        return super.push(agent);
    }

    add() {
        var agent = new this.constr();
        agent.population = this;
        super.push(agent);
        return agent;
    }
}