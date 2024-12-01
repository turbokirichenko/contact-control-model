import { ModelInterface } from "../model/model.interface";
import { PopulationInterface } from "../population/population.interface";

export interface AgentInterface {
    population?: PopulationInterface<any>
    tick: () => void | Promise<void>;
    setup: (model: ModelInterface) => void | Promise<void>;
}