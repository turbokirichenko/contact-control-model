// --------------------------------
export interface IAgent {
    tick(): void;
}

export interface IPopulation<T extends IAgent> extends IAgent {
    [index: number]: T;
    get size(): number;
    presentation: IPresentation | undefined;
    push(agent: T): number;
    add(): T;
    remove(agent: T): T | undefined;
    remove(index: number): T | undefined;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
}

export interface IModel extends IAgent {
    [token: string]: any;
    get instances(): Map<string, IPopulation<IAgent>>;
    setup(): void;
    getInstance<T extends IAgent>(token: string): IPopulation<T>;
    getOne<T extends IAgent>(token: string, index?: number): T | undefined;
}

export interface ModelConfig {
    [agentsPopulationName: string]: PopulationConfig;
}

export interface PopulationConfig {
    token?: string;
    useValue?: IAgent;
    useClass?: new (...args: any[]) => IAgent;
    size?: number;
    presentation?: IPresentation;
}

export interface IParameters {
    [param: string]: any;
}

export interface IPresentation {
    container: (obj: any) => IAbstractContainer;
    position: (obj: any) => { x: number, y: number };
    direction: (obj: any) => number;
    zIndex: (obj: any) => number;
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

export interface IAgentMap extends Map<string, PopulationConfig> {};
export interface IModelMap extends Map<string, IPopulation<any>> {};

class Population<T extends IAgent> extends Array<T> implements IPopulation<T> {
    private _constr?: { new(...args: any[]): T };
    private _value?: T;

    constructor(model: IModel, constr: { new(...args: any[]): T }, presentation?: IPresentation, initialNumber?: number);
    constructor(model: IModel, value: T,  presentation?: IPresentation, initialNumber?: number);
    constructor(
        private readonly _model: IModel, 
        constr: { new(...args: any[]): T } | T, 
        presentation?: IPresentation, 
        initialNumber: number = 1
    ) {
        super();
        this._constr = constr as { new (...args: any[]): T };
        this.presentation = presentation;
        for (let i = 0; i < initialNumber; ++i) {
            this.add();
        }
    }

    public readonly presentation;
    public get token() { 
        return this._constr?.name 
    };
    public get size() { return this.length }
    public tick() {
        this.forEach(agent => {
            agent.tick();
        });
    }
    public push(agent: T) {
        return super.push(agent);
    }
    public add() {
        var agent = this._fabric();
        super.push(agent);
        return agent;
    }
    public remove(agent: T | number): T | undefined {
        var seekIndex = typeof agent === "number" 
            ? agent 
            : this.seek(agent);
        if (seekIndex) {
            return this.splice(seekIndex, 1)[0];
        }
        return undefined;
    }
    public forEach = super.forEach;
    private _fabric(): T {
        if (Object(this._constr).prototype) {
            return new (this._constr as { new(...args: any[]): T })(this._model, this) as T;
        } else {
            return this._value as T;
        }
    }
    private seek(agent: T): number | undefined {
        var seekIndex;
        this.forEach((check, index) => {
            if (check === agent) {
                seekIndex = index;
            }
        });
        return seekIndex;
    }
}

export class Model implements IModel {
    private _map: IModelMap;
    constructor(private readonly _raw: IAgentMap) {
        this._map = new Map<string, IPopulation<IAgent>>();
    }
    public get instances() { 
        return this._map; 
    }
    public setup() {
        this._clear();
        this._setup();
    }
    public getInstance<T extends IAgent>(token: string): IPopulation<T> {
        if (this._map.has(token)) {
            return this._map.get(token)! as IPopulation<T>;
        } else {
            if (!this._raw.has(token)) {
                throw new Error('a token is not exist in the scope');
            }
            const config = this._raw.get(token);
            if (config && config.useClass) {
                this._set(token, config.useClass, config.presentation, config.size);
                return this._map.get(token)! as IPopulation<T>;
            }
            throw new Error('empty useClass');
        }
    }
    public getOne<T extends IAgent>(token: string, index: number = 0): T | undefined {
        return (this.getInstance<T>(token) as IPopulation<T>)[index] as T;
    }
    public tick() {
        this._map.forEach(agent => {
            agent.tick();
        });
    }

    private _clear() {
        this._map = new Map<string, IPopulation<IAgent>>();
    }
    private _setup() {
        this._raw.forEach((config, token) => {
            if (config && config.useClass) {
                this.getInstance(token);
            }
        });
    }
    private _set(token: string, useClass: any, presentation?: IPresentation, size?: number) {
        var population = new Population(this, useClass, presentation, size);
        this._map.set(token, population);
        Object.defineProperty(this, token, {
            value: population,
            writable: false
        });
    }
}

export function DefineModel(_config: ModelConfig) {
    var agentsMap: IAgentMap = new Map<string, PopulationConfig>();
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        var modelTokens = Object.keys(_config);
        modelTokens.forEach(token => {
            var populationConfig = _config[token];
            agentsMap.set(token, populationConfig);
        });
        return class extends constructor {
            htmodel = agentsMap;
        };
    }
}

export abstract class ModelFactory {
    private constructor() {}
    public static create(constuctor: new () => any): IModel {
        const model = new constuctor();
        if (model.htmodel && (model.htmodel as IAgentMap).has) {
            return new Model(model.htmodel);
        }
        throw new Error('cannot recognize a model');
    }
}