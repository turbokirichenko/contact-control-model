// IGlobalMap
// - объявлять глобальную переменную
// - обращаться к переменной
// - изменять переменную
// - перебирать переменные

// IModel
// - создавать популяцию
// - отключать популяцию
// - перебирать все популяции
// - обращаться к конкретной популяции

// IPopulation<IEntity> - итерируемый объект, хрянйщий совокупность сущностей
// - создавать экземпляр(ы) сущности
// - удалять экземпляр(ы) сущности
// - перебирать экземпляры сущности
// - обращаться к конкретному экземпляру

interface IModelConfig {
    actions: IActionConfig[];
    populations: IPopulationConfig<any>[];
}

interface IActionConfig {
    token: string;
    action: (model: IModel) => void;
    infinity?: boolean;
}

interface IPopulationConfig<Entity> {
    token?: string;
    useClass: new (model: IModel) => Entity;
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
    use<Entity>(token: string): IPopulation<Entity>;
    try(name: string): void;
    reset(): void;
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
}


class Model implements IModel {
    private _map;

    constructor(private readonly _config: IModelConfig) {
        this._map = new Map<string, IPopulation<any>>();
        this._config.populations.forEach(config => {
            this.use(config.token ?? config.useClass.name);
        });
    }

    use<E>(token: string): IPopulation<E> {
        if (this._map.has(token)) {
            return this._map.get(token)! as IPopulation<E>;
        } else {
            var flag = this._config.populations.filter(population => population.token === token)
            if (!flag.length) {
                throw new Error('this token is not exist in population config!');
            }
            var population = flag[0];
            return this._map.set(token, new Population(population.useClass, population.params)).get(token) as IPopulation<E>;
        }
    }

    try(token: string): void {
        var value = this._config.actions.find(value => value.token === token);
        value?.action(this);
    }

    reset() {
        this._map = new Map<string, IPopulation<any>>();
    }
}

class Population<E> extends Array<E> implements IPopulation<E> {
    constructor(private readonly _constr: { new(...args: any[]): E }, public readonly params?: IParameters) { 
        super(); 
    };

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
        var instance = new this._constr();
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