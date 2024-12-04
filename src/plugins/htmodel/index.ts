// --------------------------------
export interface IAgent {
    tick(): void;
}

export interface IPopulation<T extends IAgent> extends IAgent {
    [index: number]: T;
    get size(): number;
    push(agent: T): number;
    add(): T;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
}

export interface IModel extends IAgent {
    getInstance<T extends IAgent>(token: string): IPopulation<T>;
    getPopulation<T extends IPopulation<IAgent>>(token: string): T | undefined;
    getOne<T extends IAgent>(token: string, index?: number): T | undefined;
}

export interface ModelConfig {
    [agentsPopulationName: string]: PopulationConfig;
}

export interface PopulationConfig {
    useValue?: IAgent;
    useClass?: new (...args: any[]) => IAgent;
    size?: number;
}

export interface IAgentMap extends Map<string, PopulationConfig> {};
export interface IModelMap extends Map<string, IPopulation<IAgent>> {};

class Population<T extends IAgent> extends Array<T> implements IPopulation<T> {
    constructor(model: IModel, constr: { new(...args: any[]): T },     initialNumber?: number);
    constructor(model: IModel, value: T,                               initialNumber?: number);
    constructor(private readonly _model: IModel, constr: { new(...args: any[]): T } | T, initialNumber: number = 1) {
        super();
        this.token = 0
        this._constr = constr as { new (...args: any[]): T };
        for (let i = 0; i < initialNumber; ++i) {
            this.add();
        }
    }
    public token;
    private _constr?: { new(...args: any[]): T };
    private _value?: T;
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
    public forEach = super.forEach;
    private _fabric(): T {
        if (this._constr) {
            return new this._constr(this._model) as T;
        } else {
            return this._value as T;
        }
    }
}

class Model implements IModel {
    private readonly _agents: IAgent[] = [];
    private readonly _map: IModelMap;
    constructor(private readonly _gap: IAgentMap) {
        this._map = new Map<string, IPopulation<IAgent>>();
        this._gap.forEach((_, key)=> {
            const agent = this.getInstance(key);
            this._agents.push(agent);
        });
    }
    public playUntil() { return true };
    public getInstance<T extends IAgent>(token: string): IPopulation<T> {
        if (this._map.has(token)) {
            return this._map.get(token)! as IPopulation<T>;
        } else {
            if (!this._gap.has(token)) {
                throw new Error('a token is not exist in the scope');
            }
            const config = this._gap.get(token);
            if (config && config.useClass) {
                this._map.set(token, new Population(this, config.useClass, config.size))
                return this._map.get(token)! as IPopulation<T>;
            }
            throw new Error('empty useClass');
        }
    }
    public getPopulation<T extends IPopulation<IAgent>>(token: string): T | undefined {
        return this.getInstance(token) as T;
    }
    public getOne<T extends IAgent>(token: string, index: number = 0): T | undefined {
        return (this.getInstance<T>(token) as IPopulation<T>)[index] as T;
    }
    public tick() {
        this._agents.map(agent => {
            agent.tick();
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