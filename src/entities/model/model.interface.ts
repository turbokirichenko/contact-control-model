import { AgentInterface } from "../agent/agent.interface";
import { CowsInterface } from "../cows";
import { FarmInterface } from "../farm";

export interface ModelInterface extends AgentInterface {
    setup(): Promise<void> | void;
    cows: CowsInterface;
    farm: FarmInterface;
}