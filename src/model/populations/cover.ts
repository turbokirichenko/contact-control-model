import { IModel } from "../../plugins/htmodel/main";
import { Cow } from "./cow";

export const COVERS_TOKEN = 'covers';

export class Cover {
    public cow: Cow;
    public infectSignal: boolean;
    private _timer: number;
    private readonly _scanRadius: number;
    private readonly _loop: number;
    private readonly _proofEventCounter: number;
    private readonly _map: Map<Cover, number>;

    constructor(private readonly _model: IModel, cow: Cow) {
        this.cow = cow;
        this.infectSignal = false;
        this._timer = Math.floor(Math.random()*10);
        this._scanRadius = _model.globals?.COVER_SPREAD_RADIUS ?? 0;
        this._loop = _model.globals?.COVER_LOOP_TIME ?? 0;
        this._proofEventCounter = _model.globals?.COVER_PROOF_EVENT_COUNT ?? 0;
        this._map = new Map<Cover, number>();
    }

    public tick() {
        this._timer++;
        if (this._timer%this._loop) {
            this._scanSignals();
        }
    }

    public get data() {
        var data: Cover[] = [];
        this._map.forEach((value, cover) => {
            if (value > this._proofEventCounter) {
                data.push(cover);
            }
        })
        return data;
    }

    private _scanSignals() {
        var covers = this._model.use<Cover>(COVERS_TOKEN);
        covers?.ask(cover => {
            if(this !== cover && cover.cow.position.calcInterval(this.cow.position) < this._scanRadius) {
                var value = this._map.get(cover) ?? 0;
                this._map.set(cover, value + 1);
            }
        })
    }
}