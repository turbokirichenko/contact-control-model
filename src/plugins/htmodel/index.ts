// --------------------------------
export interface IAgent {
    population?: IPopulation<any>;
    setup(model?: IModel): void | Promise<void>;
    tick(): void;
    stop(): void;
    resume(): void;
    get isActive(): boolean;
}

export interface IAgentMap extends Map<string, IAgent> {};

export interface IPopulation<T extends IAgent> extends IAgent {
    initialNumber: number;
    push(agent: T): number;
    add(): T;
}

export class Population<T extends IAgent> extends Array<T> implements IPopulation<T> {
    public population?: IPopulation<Population<T>> | undefined;
    constructor(private _constr: { new(...args: any[]): T }, public readonly initialNumber: number = 100) {
        super();
    }
    public setup(model?: IModel) {
        for (let i = 0; i < this.initialNumber; ++i) {
            this.add();
        }
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
    push(agent: T) {
        if (agent.population) {
            throw new Error('Impossible to set population to the agent that already in any population');
        }
        agent.population = this;
        return super.push(agent);
    }
    add() {
        var agent = new this._constr();
        agent.population = this;
        super.push(agent);
        return agent;
    }
}

export interface IModel extends IAgent {
    getInstance<T extends IAgent>(token: string): T | undefined;
}

class Model implements IModel {
    private readonly _agents: IAgent[] = [];
    constructor(private readonly _map: IAgentMap) {
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
    get isActive() { return true }
}

export interface AgentsConfig {
    token: string;
    class: new (...args: any[]) => IAgent;
}

export function DefineModel(providers: AgentsConfig[]) {
    const map: IAgentMap = new Map<string, IAgent>();
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        providers.map(provider => {
            if (map.has(provider.token)) {
                throw new Error(`two or more providers had the same token: ${provider.token}`)
            } else {
                map.set(provider.token, new provider.class());
            }
        })
        return class extends constructor {
            htmodel = map;
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
export function Presentation<T extends IAgent>(config: PresentationConfig<T>) {
    config = {};
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {}
    }
}