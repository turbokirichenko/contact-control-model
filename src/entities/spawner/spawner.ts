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
        if (!this._cows.size) {
            return;
        }

        var vector = Array(this._cows.size).fill(0).map((_, index) => {
            return (this.initialSpawn > index) ? 1 : 0;
        });

        this._shuffle(vector);

        vector.map((num, index) => {
            var cow = this._cows[index];
            if (cow && num) {
                var virus = this._viruses.add();
                virus.infect(cow);
            }
        });
    }

    private _shuffle(array: any[]) {
        let currentIndex = array.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
    }

    public tick() {}
}