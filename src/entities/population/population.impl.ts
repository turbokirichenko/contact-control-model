import { AgentInterface } from "../agent/agent.interface";
import { ModelInterface } from "../model/model.interface";
import { PopulationInterface } from "./population.interface";

export class PopulationImpl<T extends AgentInterface> extends Array implements PopulationInterface<T> {
    constructor(private constr: { new(...args: any[]): T }) {
        super();
    }

    tick() {}

    setup(model: ModelInterface) {}

    push(agent: T) {
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