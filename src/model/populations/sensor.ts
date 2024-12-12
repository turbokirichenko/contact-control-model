import { IModel, IPopulation } from "../../plugins/htmodel";
import { Cow, COWS_TOKEN } from "./cow";

export class SensorV1 {
    private _cows?: IPopulation<Cow>;

    public target: Cow | null;
    public scanRadius: number;

    constructor(_model: IModel) {
        this._cows = _model.use(COWS_TOKEN);
        this.target = null;
        this.scanRadius = 3;
    }

    public tick() {
        if (this.target) {
            this._seekCowsNearly(this.target);
        }
    }

    private _seekCowsNearly(target: Cow): Array<Cow> {
        if (this._cows) {
            const radiusCows: Cow[] = [];
            for (let i = 0; i < this._cows.size; ++i) {
                if (this._cows[i].position.calcInterval(target.position) < this.scanRadius) {
                    radiusCows.push(this._cows[i]);
                }
            }
            return radiusCows;
        }
        return [];
    }
}

export class SensorV2 {

}