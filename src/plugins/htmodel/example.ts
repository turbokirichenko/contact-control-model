import { Cow, COW_TOKEN } from "../../entities/cow";

interface IModelConfig {
    globals: IParameters;
    populations: IPopulationConfig<any>[];
}

interface IPopulationConfig<Entity> {
    token?: string;
    useValue?: object;
    useClass?: new (model: IModel) => Entity;
    params?: IParameters;
    presentation?: IPresentation<Entity> | true;
}

interface IParameters {
    [param: string]: any;
}

interface IPresentation<T> {
    container: (obj?: T) => {};
    position: (obj?: T) => { x: number, y: number };
    direction: (obj?: T) => number;
    zIndex: (obj?: T) => number;
}

/** 
 * 
 */
interface IModel {
    use<Entity>(token: string): IPopulation<Entity> | undefined;
    ask(func: (target: IPopulation<any>) => void): void;
    setup(): void;
    reset(): void;
    globals: IParameters;
    [token: string]: any | undefined;
}

/** Iterable object that contains the group of Entity;
 * 
 */
interface IPopulation<Entity> {
    /** indexed the population */
    [index: number]: Entity;
    /** create 
     * 
     * @param size 
     */
    create(size: number): Entity[];
    /** remove the object from population
     * 
     * @param obj 
     */
    remove(obj: Entity):  Entity | undefined;
    /** iteration of each entity from population
     * 
     * @param func 
     */
    ask(func: (target: Entity) => void): void;
    /** population size
     * 
     */
    get size(): number;
}


class Model implements IModel {
    private _map;

    public constructor(private readonly _config: IModelConfig) {
        this._map = new Map<string, IPopulation<any>>();
    }

    public get globals() {
        return this._config.globals;
    }

    public use<E>(token?: string): IPopulation<E> | undefined{
        if (!token) {
            throw new Error('token or useClass is undefined');
        }
        if (this._map.has(token)) {
            return this._map.get(token)! as IPopulation<E>;
        } else {
            var config = this._config.populations.find(population => population.token === token)
            if (!config) {
                return undefined;
            }
            var population = new Population(config.useValue ?? config.useClass);
            /*Object.defineProperty(this, token, {
                value: population,
                writable: false,
            });*/
            return this._map.set(token, population).get(token) as IPopulation<E>;
        }
    }

    public ask(func: (target: IPopulation<any>) => void) {
        this._map.forEach(func);
    }

    public setup(): void {
        this._config.populations.forEach(config => {
            this.use(config.token ?? config.useClass?.name);
        });
    }

    public reset() {
        this._reset();
    }

    private _reset(): void {
        this._map = new Map<string, IPopulation<any>>();
    }
}

class Population<E> extends Array<E> implements IPopulation<E> {
    public constructor(private readonly _constr: E | { new(...args: any[]): E }) { 
        super();
    };

    public get size() {
        return this.length;
    }

    public create(size: number) {
        return Array(size).fill(0).map(_ => {
            return this._add();
        });
    }

    public remove(obj: E) {
        var seekIndex = this._seek(obj);
        if (seekIndex) {
            return this.splice(seekIndex, 1)[0];
        }
        return undefined;
    }

    public ask(func: (target: E) => void) {
        this.map(func);
    }

    private _add(): E {
        var instance = typeof this._constr == 'object'
            ? new (this._constr as { new(...args: any[]): E })()
            : this._constr as E;
        this.push(instance);
        return instance;
    }

    private _seek(obj: E): number | undefined {
        var seekIndex;
        this.forEach((check, index) => {
            if (check === obj) {
                seekIndex = index;
            }
        });
        return seekIndex;
    }
}

export abstract class ModelSpawner {
    public static define(config: IModelConfig) {
        return new Model(config);
    }
}

const model = ModelSpawner.define({
    globals: {
        COW_SIZE: 100,
    },
    populations: [
        { token: 'cows', useValue: { name: 'cow' } },
        { token: 'viruses', useValue: { name: 'cow' }}
    ],
});

model.setup();
const cows = model.use<{ name: string}>('cows');
if (cows) {
    cows.create(100);
}
console.log(model);