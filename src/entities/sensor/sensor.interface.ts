import { IAgent } from "../../plugins/htmodel";
import { ICow } from "../cow";

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
    depends?: ICow;
    inputDevice: InputDevice;
    streamDevice: StreamDevice;
    storage: DecodedSignal[];
}