export interface IModelConstants {
    UPDATE_INTERVAL: number;
    MAX_MODELING_TIME?: number;
}

export const MODEL_CONSTANTS: IModelConstants = {
    UPDATE_INTERVAL: 32,
}

export interface IModelConfig {
    globals?: IParameters;
    actions?: IActionConfig[];
    charts?: IChartConfig[];
    populations?: IPopulationConfig<any>[];
}

export interface IActionConfig {
    token?: string;
    useValue?: IAction;
    useCLass?: new (model: IModel/**use to get populations*/) => IAction;
}

export type IChartType = 'plot' | 'histogram';
export type IChartTrigger = 'refresh' | 'update';

export interface IChartConfig {
    token: string;
    trigger?: IChartTrigger;
    type?: IChartType;
    datasets: IDatasetConfig[];
}

export interface IDatasetConfig {
    title: string;
    capacity?: number;
    color?: number | string;
    measure: (_model: IModel) => number;
}

export interface IPopulationConfig<Entity> {
    token?: string;
    useValue?: Entity;
    useClass?: new (model: IModel/**use to get populations*/, ...args: any[]) => Entity;
    presentation?: IPresentation<Entity>;
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
    tick(): IModel;
    setup(): IModel;
    reset(): IModel;
    update(): IModel;
    refresh(): IModel;
    timer: number;
    globals: IParameters | undefined;
    actions: Map<string, IAction>;
    charts: Map<string, IChart>;
    populations: Map<string, IPopulation<any>>;
    [token: string]: any;
}

/** Statistic chart
 * 
 */
export interface IChart {
    get type(): IChartType;
    get trigger(): IChartTrigger;
    get datasets(): Map<string, IDataset>;
    reset(): void;
}

/** Dataset of some chart
 * 
 */
export interface IDataset {
    get title(): string;
    get data(): number[];
    get capacity(): number;
    get color(): number | string;
    update(): void;
}

/** Model Controller
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
    create(size: number, ...args: any[]): Entity[];
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
    /** the presentation of each agents in population  
     * 
    */
    get presentation(): IPresentation<Entity> | undefined;
}


export class Model implements IModel {
    [token: string]: any;

    private _populations;
    private _actions;
    private _charts;
    private _timer: number;

    public constructor(private readonly _config: IModelConfig) {
        this._populations = new Map<string, IPopulation<any>>();
        this._actions = new Map<string, IAction>();
        this._charts = new Map<string, IChart>();
        this._timer = 0;
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

    public get charts() {
        return this._charts;
    }

    public get timer() {
        return this._timer;
    }

    public tick(): IModel {
        if (MODEL_CONSTANTS.MAX_MODELING_TIME && this._timer > MODEL_CONSTANTS.MAX_MODELING_TIME) {
            return this;
        }
        this._timer++;
        this._populations.forEach(_pop => {
            _pop.ask(_tar => {
                if (typeof _tar.tick === 'function') {
                    _tar.tick()
                }
            })
        })
        var upd = MODEL_CONSTANTS.UPDATE_INTERVAL;
        if (this._timer%upd === 0) {
            this.update();
        }
        return this;
    }

    public update() {
        this._updateCharts('update');
        return this;
    }

    public refresh() {
        this._updateCharts('refresh');
        return this;
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
            var population = new Population(this, config.useValue ?? config.useClass, config.presentation);
            Object.defineProperty(this, token, {
                value: population,
                writable: true,
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
        this._config.charts?.forEach(config => {
            if (this._charts.has(config.token)) {
                return;
            } else {
                this._charts.set(config.token, new Chart(this, config));
            }
        })
        return this;
    }

    public reset(): IModel {
        this._timer = 0;
        this._reset();
        return this;
    }

    private _updateCharts(flag: IChartTrigger): void {
        this._charts.forEach(_chart => {
            if (_chart.trigger === flag) {
                _chart.datasets.forEach(set => {
                    set.update();
                });
            }
        });
    }

    private _reset(): void {
        this._populations.forEach((_, key) => {
            if (this[key]) {
                this[key] = undefined;
            }
        });
        this._populations = new Map<string, IPopulation<any>>();
        this._charts.forEach((chart) => {
            chart.reset();
        });
    }
}

export class Chart implements IChart {
    private _datasets: Map<string, IDataset>;

    constructor(private readonly _model: IModel, private readonly _config: IChartConfig) {
        this._datasets = new Map<string, IDataset>;
        this.reset();
    }

    public get trigger(): IChartTrigger {
        return this._config.trigger ?? 'update';
    }

    public get type(): IChartType {
        return this._config.type ?? 'plot';
    }

    public get datasets(): Map<string, IDataset> {
        return this._datasets;
    }

    public reset() {
        this._datasets = new Map<string, IDataset>;
        this._config.datasets.map(config => {
            this._datasets.set(config.title, new Dataset(this._model, config));
        });
    }
}

export class Dataset implements IDataset {
    private readonly _dataset: number[];
    private readonly _title: string;
    private readonly _capacity: number;
    private readonly _color: number | string;
    private _update: () => void;

    constructor(_model: IModel, _config: IDatasetConfig) {
        this._dataset = [];
        this._title = _config.title;
        this._capacity = _config.capacity ?? 100;
        this._color = _config.color ?? 'black';
        this._update = () => {
            var value = _config.measure(_model);
            this._dataset.push(value);
            if (this._dataset.length > this._capacity) {
                this._dataset.splice(0, this._dataset.length - this._capacity);
            }
        }
    }

    public get title(): string {
        return this._title;
    }

    public get data(): number[] {
        return this._dataset;
    }

    public get capacity(): number {
        return this._capacity;
    }

    public get color(): number | string {
        return this._color;
    }

    public update() {
        this._update();
    }
}

export class Population<E> extends Array<E> implements IPopulation<E> {

    public constructor(
        private readonly _model: IModel, 
        private readonly _constr: E | { new(model: IModel, ...args: any[]): E }, 
        private readonly _presentation?: IPresentation<E>
    ) { 
        super();
    };

    public get size() {
        return this.length;
    }

    public get presentation() {
        return this._presentation;
    }

    public create(size: number, ...params: any[]) {
        return Array(size).fill(0).map(_ => {
            return this._add(...params);
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

    private _add(...args: any[]): E {
        var instance = Object(this._constr).prototype
            ? new (this._constr as { new(model: IModel, ...args: any[]): E })(this._model, ...args)
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

export abstract class ModelFactory {
    public static define(config: IModelConfig) {
        return new Model(config).setup();
    }
}