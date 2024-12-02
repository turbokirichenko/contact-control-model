import { IModel } from "../../plugins/htmodel";
import { CowInterface } from "../cow";
import { DecodedSignal, InputDevice, SensorInterface, StreamDevice } from "./sensor.interface";

export class Sensor implements SensorInterface {
    public inputDevice: InputDevice = {
        scan: () => {
            return {
                uid: '',
                date: new Date()
            }
        }
    }

    public streamDevice: StreamDevice = {
        stream: () => {
            return true;
        }
    }

    public uid: string;
    public storage: DecodedSignal[] = [];

    constructor(public _depends?: CowInterface) {
        this.uid = (Math.random()*1e8).toString(16);
    }

    public setup(_model: IModel) {
   
    }

    public tick(): void {

    }

    public stop(): void {
        
    }

    public resume(): void {
        
    }

    public get isActive(): boolean {
        return true;
    }
}