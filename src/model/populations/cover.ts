import { IModel } from "../../plugins/htmodel/main";
import { Vector2d } from "../../plugins/vector2d";
import { Vector2dImpl } from "../../plugins/vector2d/vector2d.impl";
import { Cow } from "./cow";

export const SIGNALS_TOKEN = 'signals-token';

export class Signal {
    public cover: Cover;
    public position: Vector2d;
    private _diffuse: boolean;
    constructor(private readonly _model: IModel, cover: Cover, position: Vector2d) {
        this._diffuse = false;
        this.cover = cover;
        this.position = position;
    }

    tick() {
        if (this._diffuse) {
            this._model.use<Signal>(SIGNALS_TOKEN)?.remove(this);
        }
        this._diffuse = true;
    }
}

export const COVERS_TOKEN = 'covers-token';

export class Cover {
    public cow: Cow;
    public infectSignal: boolean;
    private _timer: number;
    private readonly _scanRadius: number;
    private readonly _loop: number;
    private readonly _proofEventCounter: number;
    private readonly _map: Map<Cover, number>;

    constructor(private readonly _model: IModel, cow: Cow) {
        console.log(cow);
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
            this._spreadSignal();
        }
    }

    public get data() {
        var data: Cover[] = [];
        this._map.forEach((value, cow) => {
            if (value > this._proofEventCounter) {
                data.push(cow);
            }
        });
        return data;
    }

    private _scanSignals() {
        var signals = this._model.use<Signal>(SIGNALS_TOKEN);
        signals?.ask(signal => {
            if ((signal.cover !== this) && (signal.position.calcInterval(this.cow.position) < this._scanRadius)) {
                var value = this._map.get(signal.cover) ?? 0;
                this._map.set(signal.cover, value + 1);
            }
        })
    }

    private _spreadSignal() {
        this._model.use<Signal>(SIGNALS_TOKEN)?.create(1, this, new Vector2dImpl(this.cow.position.x, this.cow.position.y))
    }
}