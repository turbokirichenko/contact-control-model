import { VirusInterface, VirusState } from "./virus.interface";
import { CowInterface } from "../cow";
import { IModel } from "../../plugins/htmodel";
import { Cows, COWS_TOKEN } from "../cows";

export const VIRUS_TOKEN = 'virus';

export class VirusImpl implements VirusInterface<CowInterface> {

    public infected: Map<number, CowInterface> = new Map();
    public infectionRadius: number;
    public incubationEffect: number;
    public spreadProbability: number;
    public killProbability: number;
    public state: VirusState;

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

    public setup(model: IModel) {
        const cows = model.getInstance<Cows>(COWS_TOKEN);
        if (cows) {
            const infectedIndex = Math.floor(Math.random()*cows.length);
            const infected = cows[infectedIndex];
            this.infected.set(infectedIndex, infected);
        }
    }

    public tick() {
        this.trySpread();
    }

    public stop(): void {
        
    }

    public resume(): void {
        
    }

    public get isActive(): boolean {
        return true;
    }

    private searchCowsOnArea(infected: CowInterface): [number, CowInterface][] {
        const coord = infected.getPosition();
        const cows = infected.population as Cows;
        if (cows) {
            const radiusCows: [number, CowInterface][] = [];
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