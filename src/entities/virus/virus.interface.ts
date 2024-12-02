import { IAgent } from "../../plugins/htmodel";

export type VirusState = 'none' | 'incubation' | 'active';

export interface VirusInterface<T extends IAgent> extends IAgent {
    infected: Map<number, T>;
    infectionRadius: number;
    incubationEffect: number;
    spreadProbability: number;
    killProbability: number;
    state: VirusState;
    trySpread(): boolean;
    spread(key: number, infected: T): void;
}