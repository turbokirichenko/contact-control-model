import { IModel, IPopulation } from "../../plugins/htmodel/main";
import { Cow, COWS_TOKEN, Farm, FARMS_TOKEN, Virus, VIRUSES_TOKEN } from "../populations";


export class CommonActions {
    constructor(private readonly _model: IModel) {}
    [key: string]: any;

    startup() {
        this._model.reset();
        this._model.setup();
        var initialSize = this._model.globals?.COWS_INITIAL_SIZE ?? 100;
        var cows = this._model[COWS_TOKEN] as IPopulation<Cow> | undefined;
        var farms = this._model[FARMS_TOKEN] as IPopulation<Farm> | undefined;
        var viruses = this._model[VIRUSES_TOKEN] as IPopulation<Virus> | undefined;
        if (farms && cows && viruses) {
            farms.create(1);
            var animals = cows.create(initialSize);
            var virus = viruses.create(1);
            virus[0].infect(animals[0]);
            virus[0].period = 'active';
        }
    }

    tick() {
        this._model.tick();
    }

    reset() {
        this._model.reset();
    }
}