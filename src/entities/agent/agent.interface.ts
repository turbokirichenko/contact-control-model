import { IModel } from "../../plugins/htmodel";
import { PopulationInterface } from "../population/population.interface";

export interface AgentInterface {
    population?: PopulationInterface<any>
    tick: () => void | Promise<void>;
    setup: (model: IModel) => void | Promise<void>;
}