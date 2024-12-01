import { AgentInterface } from "../agent/agent.interface";

export interface DecodedSignal {
    prevHash: string;
    scanHash: string;
    date: Date;
}

export interface InputDevice {
    scan(): DecodedSignal;
}

export interface StreamDevice {
    streamWave(): boolean;
}

export interface SensorInterface extends AgentInterface {
    inputDevice: InputDevice;
    streamDevice: StreamDevice;
    storage: DecodedSignal[];
    getInfograph(): object;
}