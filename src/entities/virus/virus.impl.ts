import { VirusInterface, VirusState } from "./virus.interface";
import { CowInterface } from "../cow";
import { ModelInterface } from "../model/model.interface";
import { CowsInterface } from "../cows";

export class VirusImpl implements VirusInterface<CowInterface> {

    public infected: Map<number, CowInterface> = new Map();
    public infectionRadius: number;
    public incubationEffect: number;
    public spreadProbability: number;
    public killProbability: number;
    public state: VirusState;
    private _counter = 0;
    private _tryTime = 5;

    constructor() {
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
                if (Math.random()*1000 < this.spreadProbability*1000) {
                    this.spread(key, cow);
                }
            });
        });
        return false;
    }

    public spread(key: number, infected: CowInterface): void {
        this.infected.set(key, infected);
    }

    public setup(model: ModelInterface) {
        const infectedIndex = Math.floor(Math.random()*model.cows.length);
        const infected = model.cows[infectedIndex];
        this.infected.set(infectedIndex, infected);
    }

    public tick() {
        this.trySpread();
    }

    private searchCowsOnArea(infected: CowInterface): [number, CowInterface][] {
        const coord = infected.getPosition();
        const cows = infected.population as CowsInterface;
        if (cows) {
            const radiusCows: [number, CowInterface][] = []
            cows.map((cow, index) => {
                if (cow.getPosition().calcInterval(coord) < this.infectionRadius) {
                    radiusCows.push([index, cow]);
                }
            })
            return radiusCows;
        }
        return [];
    }
}