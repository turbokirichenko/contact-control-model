import { IAgent, IModel } from "../../plugins/htmodel";
import { ICow } from "../cow";
import { DecodedSignal } from "./sensor.interface";

export class Sensor implements IAgent {
    public uid: string;
    public storage: DecodedSignal[] = [];

    constructor(public _depends?: ICow) {
        this.uid = (Math.random()*1e8).toString(16);
    }
    public setup(_model: IModel) {}
    public tick(): void {}
}