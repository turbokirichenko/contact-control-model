export interface PopulationInterface<T = any> extends Array<T> {
    push(agent: T): number;
}