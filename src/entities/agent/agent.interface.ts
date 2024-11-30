import { PopulationInterface } from "../population/population.interface";

export interface AgentInterface {
    population?: PopulationInterface<any>
    tick(): void | Promise<void>;
}