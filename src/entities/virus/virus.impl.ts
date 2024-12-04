import { VirusInterface, VirusState } from "./virus.interface";
import { CowInterface } from "../cow";
import { IModel } from "../../plugins/htmodel";
import { Cow, COW_TOKEN } from "../cow";
import { IPopulation } from "../../plugins/htmodel";

export const VIRUS_TOKEN = 'virus';

export class VirusImpl implements VirusInterface<CowInterface> {

    public infected: Map<number, CowInterface> = new Map();
    public infectionRadius: number;
    public incubationEffect: number;
    public spreadProbability: number;
    public killProbability: number;
    public state: VirusState;

    constructor(private readonly _model: IModel) {
        const cows = this._model.getPopulation(COW_TOKEN) as IPopulation<Cow>;
        if (cows) {
            const infectedIndex = Math.floor(Math.random()*cows.size);
            const infected = cows[infectedIndex] as CowInterface;
            this.infected.set(infectedIndex, infected);
        }
        this.infectionRadius = 10;
        this.spreadProbability = 0.001;
        this.incubationEffect = 12*60*60;
        this.killProbability = 0.01;
        this.state = 'none';
    }
    
    public trySpread(): boolean {
        this.infected.forEach((infects) => {
            const cows = this.searchCowsOnArea(infects);
            cows.map(([key, cow ]) => {
                if (Math.random() < this.spreadProbability) {
                    this.spread(key, cow);
                }
            });
        });
        return false;
    }
    public spread(key: number, infected: CowInterface): void {
        this.infected.set(key, infected);
    }
    public setup() {}
    public tick() {
        this.trySpread();
    }
    private searchCowsOnArea(infected: CowInterface): [number, CowInterface][] {
        const coord = infected.getPosition();
        const cows = infected.population as IPopulation<Cow>;
        if (cows) {
            const radiusCows: [number, CowInterface][] = [];
            for (let i = 0; i < cows.size; ++i) {
                if (cows[i].getPosition().calcInterval(coord) < this.infectionRadius) {
                    radiusCows.push([i, cows[i]]);
                }
            }
            return radiusCows;
        }
        return [];
    }
}