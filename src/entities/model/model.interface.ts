import { AgentInterface } from "../agent/agent.interface";
import { CowInterface } from "../cow";
import { CowsInterface } from "../cows";
import { FarmInterface } from "../farm";
import { VirusInterface } from "../virus";

export interface ModelInterface extends AgentInterface {
    setup(): Promise<void> | void;
    cows: CowsInterface;
    farm: FarmInterface;
    virus: VirusInterface<CowInterface>;
}