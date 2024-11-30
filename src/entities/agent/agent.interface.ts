export interface AgentInterface {
    tick(): void | Promise<void>;
}