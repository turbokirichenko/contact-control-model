import { IAgent, IModel, IPopulation } from "../../plugins/htmodel";
import type { IVirus } from "../virus";
import type { ICow } from "../cow";
import { COW_TOKEN } from "../cow";
import { VIRUS_TOKEN } from "../virus";

export const VIRUS_SPAWNER_TOKEN = 'virus-spawner';

export class VirusSpawner implements IAgent {
    public initialSpawn: number = 1;
    private readonly _viruses: IPopulation<IVirus<ICow>>;
    private readonly _cows: IPopulation<ICow>;

    constructor(private readonly _model: IModel) {
        this._viruses = this._model.getInstance<IVirus<ICow>>(VIRUS_TOKEN);
        this._cows = this._model.getInstance<ICow>(COW_TOKEN);

        for (let i = 0; i < this.initialSpawn; ++i) {
            var virus = this._viruses.add();
            var cow = this._cows[Math.floor(Math.random()*this._cows.size)];
            virus.infect(cow);
        }
    }

    public tick() {}
}