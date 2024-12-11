import { IModel, IPopulation } from "../../plugins/htmodel/main";
import { Cow, COWS_TOKEN } from "../populations/cow";

export const VIRUSES_TOKEN = 'viruses';

export class Virus {
    private _cows?: IPopulation<Cow>;
    private _viruses?: IPopulation<Virus>;

    public infected: Cow | null;
    public infectZone: number;
    public infectProbability: number;
    
    constructor(private readonly _model: IModel) {
        this._cows = this._model.use<Cow>(COWS_TOKEN);
        this._viruses = this._model.use<Virus>(VIRUSES_TOKEN);
        this.infectZone = this._model.globals?.VIRUS_INFECT_RADIUS;
        this.infectProbability = this._model.globals?.VIRUS_SPREAD_PROBABILITY;
        this.infected = null;
    }

    public tick() {
        if (this.infected) {
            var cows = this._seekInfectedCows(this.infected);
            cows.map(_cow => {
                var spawns = this._viruses?.create(1) as Virus[] | undefined;
                if (spawns?.length) {
                    spawns[0].infect(_cow);
                }
            });
        }
    }

    public infect(_obj: Cow) {
        var flag = true;
        this._viruses?.ask(virus => {
            if (virus.infected === _obj) {
                flag = false;
            }
        });
        if (flag) {
            this.infected = _obj;
        } else {
            this._viruses?.remove(this);
        }
    }

    private _seekInfectedCows(infected: Cow): Array<Cow> {
        if (this._cows) {
            const radiusCows: Cow[] = [];
            for (let i = 0; i < this._cows.size; ++i) {
                if (this._cows[i].position.calcInterval(infected.position) < this.infectZone) {
                    if (Math.random() < this.infectProbability) {
                        radiusCows.push(this._cows[i]);
                    }
                }
            }
            return radiusCows;
        }
        return [];
    }
}