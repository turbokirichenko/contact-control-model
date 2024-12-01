import { AgentInterface } from "../agent/agent.interface";

export interface PopulationInterface<T = any> extends Array<T>, AgentInterface {
    push(agent: T): number;
    add(): T;
}