import { IVirus } from "./virus.interface";
import { ICow } from "../cow";
import { IModel } from "../../plugins/htmodel";
import { COW_TOKEN } from "../cow";
import { IPopulation } from "../../plugins/htmodel";

export const VIRUS_TOKEN = 'virus';

export class Virus implements IVirus<ICow> {
    public infected: ICow | null;
    public radius: number;
    public incubationPeriod: number;
    public spreadProbability: number;
    public killProbability: number;
    public period: "none" | "incubation" | "ill";
    private readonly _cows: IPopulation<ICow>;

    constructor(private readonly _model: IModel) {
        this.infected = null;
        this.radius = 2;
        this.incubationPeriod = 20*60;
        this.killProbability = 0.001;
        this.spreadProbability = 0.001;
        this.period = 'none';
        this._cows = this._model.getInstance<ICow>(COW_TOKEN);
    }

    public setup() {}

    public tick() {
        this.spread();
    }

    public infect(to: ICow): void {
        const virus = this._model.getInstance<Virus>(VIRUS_TOKEN);
        var flag = false;
        virus.forEach(virus => {
            if (to === virus.infected) {
                flag = true;
            }
        });
        if (flag) {
            virus.remove(this);
        };
        this.infected = to;
    }

    public spread(): void {
        if (this.infected) {
            var cows = this._seekInRadius(this.infected);
            cows.forEach((cow) => {
                if (Math.random() < this.spreadProbability) {
                    var viruses = this._model.getInstance<Virus>(VIRUS_TOKEN);
                    for (let i = 0; i < viruses?.size; ++i) {
                        if (cow === viruses[i].infected) {
                            return;
                        }
                    }
                    var virus = viruses.add();
                    virus.infect(cow);
                }
            });
        } else {
            const virus = this._model.getInstance<Virus>(VIRUS_TOKEN);
            virus.remove(this);
        }
    }

    private _seekInRadius(infected: ICow): Array<ICow> {
        var coord = infected.getPosition();
        var cows = this._cows;
        if (cows) {
            const radiusCows: ICow[] = [];
            for (let i = 0; i < cows.size; ++i) {
                if (cows[i].getPosition().calcInterval(coord) < this.radius) {
                    radiusCows.push(cows[i]);
                }
            }
            return radiusCows;
        }
        return [];
    }
}