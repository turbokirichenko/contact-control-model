import { IAgent } from "../../plugins/htmodel";
import { CowInterface } from "../cow";

export interface DecodedSignal {
    uid: string;
    date: Date;
}

export interface InputDevice {
    scan(): DecodedSignal;
}

export interface StreamDevice {
    stream(): boolean;
}

export interface SensorInterface extends IAgent {
    uid: string;
    depends?: CowInterface;
    inputDevice: InputDevice;
    streamDevice: StreamDevice;
    storage: DecodedSignal[];
}