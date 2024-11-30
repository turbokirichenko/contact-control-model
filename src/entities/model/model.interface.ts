import { AgentInterface } from "../agent/agent.interface";
import { Cow } from "../cow";
import { Farm } from "../farm";

export interface ModelInterface extends AgentInterface {
    setup(): Promise<void> | void;
    cow: Cow;
    farm: Farm;
}