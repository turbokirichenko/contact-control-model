import { AgentInterface } from "../agent/agent.interface";
import { PopulationInterface } from "./population.interface";

export class PopulationImpl extends Array implements PopulationInterface<AgentInterface> {
    constructor(agents?: AgentInterface[]) {
        super();
        agents?.forEach((agent) => {
            agent.population = this;
            this.push(agent)
        });
    }

    push(agent: AgentInterface) {
        agent.population = this;
        return super.push(agent);
    }
}