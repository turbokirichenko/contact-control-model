export interface IModelConfig {
    globals?: IParameters;
    actions?: IActionConfig[];
    populations?: IPopulationConfig<any>[];
}

export interface IActionConfig {
    token?: string;
    useValue?: IAction;
    useCLass?: new (model: IModel/**use to get populations*/) => IAction;
}

export interface IPopulationConfig<Entity> {
    token?: string;
    useValue?: Entity;
    useClass?: new (model: IModel/**use to get populations*/) => Entity;
    presentation?: IPresentation<Entity> | true;
}

export interface IParameters {
    [param: string]: any;
}

export interface IPresentation<T> {
    container: (obj?: T) => IAbstractContainer;
    position: (obj?: T) => { x: number, y: number };
    direction: (obj?: T) => number;
    zIndex: (obj?: T) => number;
}

export interface IAbstractContainer {
    width: number;
    height: number;
    positionX?: number;
    positionY?: number;
    type?: 'circle' | 'rect';
    fill: string | number;
    opacity?: number;
}

/** 
 * 
 */
export interface IModel {
    use<Entity>(token: string): IPopulation<Entity> | undefined;
    setup(): IModel;
    reset(): IModel;
    globals: IParameters | undefined;
    actions: Map<string, IAction>;
    populations: Map<string, IPopulation<any>>;
    [token: string]: any;
}

/**
 * 
 */
export interface IAction {
    [action: string]: () => void;
}

/** Iterable object that contains the group of Entity;
 * 
 */
export interface IPopulation<Entity> {
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


export class Model implements IModel {
    [token: string]: any;

    private _populations;
    private _actions;

    public constructor(private readonly _config: IModelConfig) {
        this._populations = new Map<string, IPopulation<any>>();
        this._actions = new Map<string, IAction>();
    }

    public get globals() {
        return this._config.globals;
    }

    public get populations() {
        return this._populations;
    }

    public get actions() {
        return this._actions;
    }

    public use<E>(token?: string): IPopulation<E> | undefined{
        if (!token) {
            throw new Error('token or useClass is undefined');
        }
        if (this._populations.has(token)) {
            return this._populations.get(token)! as IPopulation<E>;
        } else {
            var config = this._config.populations?.find(population => population.token === token)
            if (!config) {
                return undefined;
            }
            var population = new Population(this, config.useValue ?? config.useClass);
            Object.defineProperty(this, token, {
                value: population,
                writable: false,
            });
            return this._populations.set(token, population).get(token) as IPopulation<E>;
        }
    }

    public run(token?: string): any | undefined{
        if (!token) {
            throw new Error('token or useClass is undefined');
        }
        if (this._actions.has(token)) {
            return this._actions.get(token)!;
        } else {
            var config = this._config.actions?.find(action => action.token === token)
            if (!config) {
                return undefined;
            }
            var action = config.useValue ?? new config.useCLass!(this);
            Object.defineProperty(this, token, {
                value: action,
                writable: false,
            });
            return this._actions.set(token, action).get(token);
        }
    }

    public ask(func: (target: IPopulation<any>) => void) {
        this._populations.forEach(func);
    }

    public setup(): IModel {
        this._config.populations?.forEach(config => {
            this.use(config.token ?? config.useClass?.name);
        });
        this._config.actions?.forEach(config => {
            this.run(config.token ?? config.useCLass?.name);
        });
        return this;
    }

    public reset(): IModel {
        this._reset();
        return this;
    }

    private _reset(): void {
        this._populations = new Map<string, IPopulation<any>>();
    }
}

export class Population<E> extends Array<E> implements IPopulation<E> {

    public constructor(private readonly _model: IModel, private readonly _constr: E | { new(model: IModel): E }) { 
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
        var instance = Object(this._constr).prototype
            ? new (this._constr as { new(model: IModel): E })(this._model)
            : JSON.parse(JSON.stringify(this._constr)) as E;
        this.push(instance);
        return instance;
    }

    private _seek(obj: E): number | undefined {
        var seekIndex;
        this.map((check, index) => {
            if (check === obj) {
                seekIndex = index;
            }
        });
        return seekIndex;
    }
}

export abstract class ModelSpawner {
    public static define(config: IModelConfig) {
        return new Model(config).setup();
    }
}