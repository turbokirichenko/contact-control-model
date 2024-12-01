import { AgentInterface } from "../agent/agent.interface";

export type VirusState = 'none' | 'incubation' | 'active';

export interface VirusInterface<T extends AgentInterface> extends AgentInterface {
    infected: Map<number, T>;
    infectionRadius: number;
    incubationEffect: number;
    spreadProbability: number;
    killProbability: number;
    state: VirusState;
    trySpread(): boolean;
    spread(key: number, infected: T): void;
}