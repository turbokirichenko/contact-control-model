// --------------------------------
export interface IAgent {
    population?: IPopulation<any>;
    setup(model?: IModel): void | Promise<void>;
    tick(): void;
    stop(): void;
    resume(): void;
    get isActive(): boolean;
}

export interface IPopulation<T extends IAgent> extends IAgent {
    [index: number]: T;
    get size(): number;
    push(agent: T): number;
    add(): T;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
}

class Population<T extends IAgent> extends Array<T> implements IPopulation<T> {
    public population?: IPopulation<Population<T>> | undefined;
    static create<T extends IAgent>(obj: T): typeof Population<typeof obj> {
        return Population<T>;
    }
    private _constr?: { new(...args: any[]): T };
    private _value?: T;
    public get size() { return this.length }
    constructor(constr: { new(...args: any[]): T },     initialNumber?: number);
    constructor(value: T,                               initialNumber?: number);
    constructor(constr: { new(...args: any[]): T } | T, initialNumber: number = 100) {
        super();
        this._constr = constr as { new (...args: any[]): T };
        for (let i = 0; i < initialNumber; ++i) {
            this.add();
        }
    }
    public setup(model?: IModel) {
        this.forEach(agent => {
            agent.setup(model)
        });
    };
    public tick() {
        this.forEach(agent => {
            agent.tick();
        });
    }
    public stop() {}
    public resume() {}
    public get isActive() { return true }
    public push(agent: T) {
        if (agent.population) {
            throw new Error('Impossible to set population to the agent that already in any population');
        }
        agent.population = this;
        return super.push(agent);
    }
    public add() {
        var agent = this.fabric();
        agent.population = this;
        super.push(agent);
        return agent;
    }
    public forEach = super.forEach;
    private fabric(): T {
        if (this._constr) {
            return new this._constr() as T;
        } else {
            return this._value as T;
        }
    }
}

export interface IModel extends IAgent {
    getInstance<T extends IAgent>(token: string): T | undefined;
    getPopulation<T extends IPopulation<IAgent>>(token: string): T | undefined;
    getAgentFromPopulationByIndex<T extends IAgent>(token: string, index: number): T | undefined;
}

export interface IAgentMap extends Map<string, IAgent> {};
export interface IPopulationMap extends Map<string, IAgent> {};

export class Model implements IModel {
    private readonly _agents: IAgent[] = [];
    constructor(private readonly _map: IPopulationMap) {
        this._map.forEach((_, key)=> {
            const agent = this._map.get(key) as IAgent;
            this._agents.push(agent);
        });
    }
    public playUntil() { return true };
    public async setup() {
        this._agents.forEach(agent => {
            agent.setup(this);
        });
    }
    public getInstance<T extends IAgent>(token: string): T | undefined {
        return this._map.get(token) as T;
    }
    public getPopulation<T extends IPopulation<IAgent>>(token: string): T | undefined {
        return this._map.get(token) as T;
    }
    public getAgentFromPopulationByIndex<T extends IAgent>(token: string, index: number): T | undefined {
        return (this._map.get(token) as Population<T>)[index] as T;
    }
    public tick() {
        this._agents.map(agent => {
            agent.tick();
        });
    }
    public stop() {
        this._agents.map(agent => {
            agent.stop();
        });
    }
    public resume() {
        this._agents.map(agent => {
            agent.resume();
        });
    }
    get isActive() { return true };
}

export interface AgentsConfig {
    token: string;
    class: new (...args: any[]) => IAgent;
}

export interface ModelConfig {
    [agentsPopulationName: string]: PopulationConfig;
}

export interface PopulationConfig {
    useValue?: IAgent;
    useClass?: new () => IAgent;
    size?: number;
}

export function DefineModel(_config: ModelConfig) {
    var agentsMap: IAgentMap = new Map<string, IAgent>();
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        var modelTokens = Object.keys(_config);
        modelTokens.map(token => {
            if (agentsMap.has(token)) {
                
            } else {
                var populationConfig = _config[token];
                if (!populationConfig.useValue && !populationConfig.useClass) {
                    throw new Error('one of useValue or useClass must contain type PopulationConfig')
                }
                else if (!populationConfig.size || populationConfig.size < 0) {
                    if (populationConfig.useClass) {
                        agentsMap.set(token, new populationConfig.useClass())
                    }
                    else if (populationConfig.useValue) {
                        agentsMap.set(token, populationConfig.useValue);
                    }
                }
                else {
                    if (populationConfig.useClass) {
                        agentsMap.set(token, new Population(populationConfig.useClass, populationConfig.size))
                    }
                }
            }
        });
        return class extends constructor {
            htmodel = agentsMap;
        };
    }
}

export function DefinePopulation <T extends IAgent>(_constr: { new(...args: any[]): T }, _initialNumber: number = 100): typeof Population<T> {
    return class extends Population<T> implements IPopulation<T> {
        constructor() {
            super(_constr, _initialNumber)
        }
    }
}

export function PopulationDefinition(_initialNumber: number = 100) {
    return function <T extends IAgent>(_constr: { new(): T }) {
        return class extends Population<T> {
            constructor() {
                super(_constr, _initialNumber)
            }
        }
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

export type PresentationRule<T, R> = ((target: T, model: IModel, ...args: any[]) => R) | R;
export interface PresentationConfig<T extends IAgent> {
    anchor?: PresentationRule<T, number>;
    width?: PresentationRule<T, number>;
    height?: PresentationRule<T, number>;
    alias?: PresentationRule<T, string>;
    fill?: PresentationRule<T, string | number>;
    position?: PresentationRule<T, [number, number]>;
    direction?: PresentationRule<T, number>;
}
export function Presentation<T extends IAgent>(_config: PresentationConfig<T>) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {}
    }
}