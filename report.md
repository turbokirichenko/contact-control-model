## ДТЗ Кириченко

## Введение

Агенто-ориентированное моделирование применяется с целью обнаружения зависимостей взаимодействия агентов.
Агенто-ориентированные модели используются в биологии для моделирования эпидемий, ареалов обитания животных, химических взаимодействий, в физике небесных тел и другое.
Как правило, для подобного подхода характерно рассмотрение агентов не как самостоятельных сущностей, а как составляющих звеньев общей популяции. Такой подход позволяет акцентировать внимание на изменениях характеристик совокупности агентов, в целом, в зависимости от заданных параметров модели, что может быть полезным для моделирования большого количества массива сущностей имеющих схожие характеристики.
После вспышки пандемии SARS-COV-2 интерес к агенто-ориентированному подходу моделировании вырос, поскольку данный подход позволяет охватывать процесс модели распространение вируса внутри представленной популяции или совокупностей популяции и проводить анализ по возможным характеристикам вируса, для планирования реальных задачи для устранения вспышки заболеваемости. Актуальность работы обоснована научным интересом к поиску возможных средств и приемов для контроля за заболеваемостью в рамках популяции или совокупности популяций агентов. Модель отвечающая задаче имитации ситуации вспышки вирусной инфекции и моделирующая процесс по контролю за заболеваемостью необходимо должна отвечать следующим требованиям:

1. Охватывает одну или более популяцию в рамках ограниченной местности
2. Описывает и реализует методы для контроля и превентивного реагирования распространение вирусов
3. Описывает поведение и подробные характеристики агентов популяции
4. Описывает поведение и подробные характеристики вирусов
5. Содержит набор статистических данных для анализа

Исходя из актуальности исследования сформулируем проблему исследования: "Агенто-ориентированное моделирование"

Ориентируясь на проблему исследования, актуальность и требования к модели, мы можем формулировать тему исследования: "Моделирование системы контроля за распространением вируса внутри популяции агентов"

Объект исследования: Вирусология

Предмет исследования: Система контроля за распространением вируса внутри популяции агентов

## Глава 1. Система моделирования

### Выбор системы моделирования

В рамках данной работы мы приняли решение реализовать собственную систему моделирования затрагивающую исключительно популяционно-ориентированный подход моделирования. Где базовые сущности взаимодействуют в рамках популяции представленной массивом данных.

### Дизайн и архитектура

Система моделирования представляет из себя набор интерфейсов и реализаций нескольких базовых классов: Модель, Популяция, Агент, График, Действия

#### Модель `Model`

Представляет из себя класс содержащий базовую логику модели

```typescript
interface IModel {
    /** использовать популяцию */
    use<Entity>(token: string): IPopulation<Entity> | undefined;
    /** такт времени */
    tick(): IModel;
    /** создать конфигурацию модели */
    setup(): IModel;
    /** сбросить состояние модели до исходного */
    reset(): IModel;
    /** обновить графики */
    update(): IModel;
    /** обновить графики (контроллер) */
    refresh(): IModel;
    /** время в секундах со старта модели */
    timer: number;
    /** глобальные переменные */
    globals: IParameters | undefined;
    /** контроллеры */
    actions: Map<string, IAction>;
    /** данные статистики */
    charts: Map<string, IChart>;
    /** популяции */
    populations: Map<string, IPopulation<any>>;
    /** индексируемые поля (популяции, контроллеры) */
    [token: string]: any;
}
```

#### Популяция `Population<AgentType>`

Представляет из себя реализацию класса содержащего популяцию агентов. Интерфейс данного класса содержит фабрику агентов, позволяющую создавать несколько агентов внутри популяции, а также функции удаления и перебора всей заданной популяции.

```ts
interface IPopulation<Entity> {
    /** индекс агента в массиве */
    [index: number]: Entity;
    /** создание агента/агентов
     * 
     * @param size 
     */
    create(size: number, ...args: any[]): Entity[];
    /** удаление агента
     * 
     * @param obj 
     */
    remove(obj: Entity):  Entity | undefined;
    /** перебор агентов в популяции
     * 
     * @param func 
     */
    ask(func: (target: Entity) => void): void;
    /** размер
     * 
     */
    get size(): number;
    /** презентация
     * 
    */
    get presentation(): IPresentation<Entity> | undefined;
}
```

#### Агент `Agent`

Абстрактный класс, может содержать поле tick(), обновляющееся каждый такт

```ts
interface Agent {
    tick?: () => void;
}
```

При создании класса в конструктор каждого класса агентов принимается сама модель по паттерну 'dependency injection'

```ts
class SomeAgent {
    constructor(_model: Model, ...args: any[]) {
        var population = _model.use<Population>('population-token');
    }
}
```

#### График `Chart`

содержит совокупность наборов данных

```ts
interface IChart {
    get type(): IChartType; // 'histogram' | 'plot'
    /** обновляеться по интервалу или по  вызову функции */
    get trigger(): IChartTrigger; // 'update' | 'refresh'
    /** данные */
    get datasets(): Map<string, IDataset>;
    /** сбросить */
    reset(): void;
}
```

### Создание и запуск модели

Чтобы создать модель необходимо заполнить конфигурационный файл, содержащий классы агентов, контроллеров, переменных

```ts
interface IModelConfig {
    globals?: IParameters;
    actions?: IActionConfig[];
    charts?: IChartConfig[];
    populations?: IPopulationConfig<any>[];
}
```

Далее выполнить создание модели при помощи фабрики

```typescript
import { ModelFactory } from "../path/to/lib";
import { modelConfig } from "../path/to/config";

export const model = ModelFactory.define(modelConfig);
```

### Визуализация

Визуализация модели представлена реализацией абстрактного контейнера при помощи  библиотеки `'pixi.js'`. Чтобы отобразить объект необходимо задать свойства презентации в конфигурационном файле.

#### PresentationConfig

```ts
interface IPresentation<T> {
    /** свойства контейнера (вычисляется каждый такт) */
    container: (obj?: T) => IAbstractContainer;
    /** позиция (вычисляется каждый такт) */
    position: (obj?: T) => { x: number, y: number };
    /** наклон (вычисляется каждый такт) */
    direction: (obj?: T) => number;
    /** высота (вычисляется каждый такт) */
    zIndex: (obj?: T) => number;
}
```

#### ModelScene

Реализация визуализации модели, чтобы включить необходимо выполнить следующие действия

```ts
import { model, bootstap } from 'path/to/model';
import { ModelScene } from 'path/to/lib/pixi.js';

const scene = new ModelScene(model);

// запуск сервера с моделью
bootstap(scene).listen();
```

## Глава 2. Моделирование

### Описание модели

Модель предназначена для симуляции системы по контролю за вирусами в рамках популяции агентов с прогрессирующей эпидемией вируса. Модель состоит из следующих популяций: 

1. Population(Cow) - некоторая популяция домашнего скота состоящего из множества коров, на примере которой мы будет отслеживать распространение вируса
2. Population(Farm) - популяция из одного статического агента - ферма, представляющее поле для взаимодействие других популяций.
3. Population(Virus) - популяция вирусов, распространяется воздушно-капельным путем. Вероятность заболеть за одну секунду контакта с носителем активного вируса - 0.01.
4. Population(Cover) - популяция сенсоров, привязанных к каждой особи популяции домашнего скота, представляет распределенную систему отслеживания контактов между особями (агентами) популяции. Принцип работы состоит из сканирования устройств, находящихся рядом и обновления счетчика для всех обнаруженных рабом устройств, в конце, устройство будет содержать данные с массивом данных о контактах.

### Описание агентов

#### Farm

Ферма, представляет из себя площадь размером NxN метров, все агенты популяции Cows не выходят за пределы этой площади.

```ts
// реализация класса агента фермы
export class Farm {
    public width: number;
    public height: number;
    public position: Vector2d;
    constructor(_model: IModel) {
        this.width = _model.globals?.FARM_WIDTH_METERS ?? FARM_DEFAULT_WIDTH;
        this.height = _model.globals?.FARM_HEIGHT_METERS ?? FARM_DEAFULT_HEIGHT;
        this.position = new Vector2d(
            _model.globals?.FARM_POSITION_X ?? 0, 
            _model.globals?.FARM_POSITION_Y ?? 0
        );
    }
}
```

#### Cow

Корова, домашний скот - агент, действие которого состоит в перемещении по ферме, с некоторыми интервалами отдыха (бездействия) по равномерному закону распределения `uni(0, WAITING_TIME)`.

```ts
export interface ICow {
    public width: number;
    public height: number;
    public speed: number;
    public position: Vector2dInterface;
    public targetPoint: Vector2dInterface;
    public get direction();
    public tick();
}
```

#### Virus

Жизненный цикл вируса состоит из 3х этапов:

1. Появление вируса. Вирус пытается заразить особь с некоторой вероятностью, либо исчезает.
2. Заражение особи и начало инкубационного периода. На этой стадии вирус не может распространятся, вирус сложно определить визуальными методами, нет никаких выраженных симптомов.
3. Активная стадия вируса. На данной стадии вируса начинаются первые симптомы, объект заражения становится заразен.

Реализация класса вируса

```ts
export class Virus {
    private _cows?: IPopulation<Cow>;
    private _viruses?: IPopulation<Virus>;
    private _seconds: number = 0;
    private _incubationTime: number;

    public infected: Cow | null;
    public infectZone: number;
    public infectProbability: number;
    public period: 'none' | 'incubation' | 'active';
    
    constructor(private readonly _model: IModel, cow?: Cow) {
        this._cows = this._model.use<Cow>(COWS_TOKEN);
        this._viruses = this._model.use<Virus>(VIRUSES_TOKEN);
        this.infectZone = this._model.globals?.VIRUS_INFECT_RADIUS;
        this.infectProbability = this._model.globals?.VIRUS_SPREAD_PROBABILITY;
        this._incubationTime = this._model.globals?.VIRUS_INCUBATION_TIME;
        this.infected = cow ?? null;
        this.period = 'none';
    }

    public tick() {
        if (this.infected) {
            if (this.period === 'active') {
                var cows = this._seekInfectedCows(this.infected);
                cows.map(_cow => {
                    var spawns = this._viruses?.create(1) as Virus[] | undefined;
                    if (spawns?.length) {
                        spawns[0].infect(_cow);
                    }
                });
            } else {
                this._seconds++;
                if (this._seconds >= this._incubationTime) {
                    this.period = 'active';
                }
            }
        }
    }

    public infect(_obj: Cow) {
        var flag = true;
        this._viruses?.ask(virus => {
            if (virus.infected === _obj) {
                flag = false;
            }
        });
        if (flag) {
            this.infected = _obj;
            this.period = 'incubation';
        } else {
            this._viruses?.remove(this);
        }
    }

    private _seekInfectedCows(infected: Cow): Array<Cow> {
        if (this._cows) {
            const radiusCows: Cow[] = [];
            for (let i = 0; i < this._cows.size; ++i) {
                if (this._cows[i].position.calcInterval(infected.position) < this.infectZone) {
                    if (Math.random() < this.infectProbability) {
                        radiusCows.push(this._cows[i]);
                    }
                }
            }
            return radiusCows;
        }
        return [];
    }
}
```

#### Cover

Сенсор для сканирования других сенсоров, расположенных поблизости посредством беспроводного протокола Bluetooth Low Energy. Сенсоры обмениваются информацией между собой, с интервалами N секунд. При обращении к каждому сенсору мы можем узнать наиболее частые контакты. Каждый сенсор содержит ссылку на привязанного агента.

```ts
export class Cover {
    public cow: Cow;
    public infectSignal: boolean;
    private _timer: number;
    private readonly _scanRadius: number;
    private readonly _loop: number;
    private readonly _proofEventCounter: number;
    private readonly _map: Map<Cover, number>;

    constructor(private readonly _model: IModel, cow: Cow) {
        this.cow = cow;
        this.infectSignal = false;
        this._timer = Math.floor(Math.random()*10);
        this._scanRadius = _model.globals?.COVER_SPREAD_RADIUS ?? 0;
        this._loop = _model.globals?.COVER_LOOP_TIME ?? 0;
        this._proofEventCounter = _model.globals?.COVER_PROOF_EVENT_COUNT ?? 0;
        this._map = new Map<Cover, number>();
    }

    public tick() {
        this._timer++;
        if (this._timer%this._loop) {
            this._scanSignals();
        }
    }

    public get data() {
        var data: Cover[] = [];
        this._map.forEach((value, cover) => {
            if (value > this._proofEventCounter) {
                data.push(cover);
            }
        })
        return data;
    }

    private _scanSignals() {
        var covers = this._model.use<Cover>(COVERS_TOKEN);
        covers?.ask(cover => {
            if(this !== cover && cover.cow.position.calcInterval(this.cow.position) < this._scanRadius) {
                var value = this._map.get(cover) ?? 0;
                this._map.set(cover, value + 1);
            }
        })
    }
}
```

### Описание взаимодействия агентов

#### Startup

Функция отвечающая за начальную настройку модели:

1. Обновляет состояние модели.
2. Создает агентов популяции Cows.
3. Прикрепляет к каждой из коров по одному сенсору.
4. Создает первый экземпляр вируса и поражает им одну из коров, состояние вируса сразу становится 'active'.

#### Tick

Функция отвечающая за каждый такт модели

1. Запускает model.tick() - один такт модели

#### Detect

Функция обнаружения вирусов по данным сенсоров 'Cover'. Функция выполняет следующие действия:

1. Находит зараженных животных с вирусом в активной фазе. (В реальной жизни их легче обнаружить по визуальным симптомам)
2. Считывает информацию с датчиков каждого из зараженных.
3. Помечает найденных животных как 'зараженные'.
4. Обновляет статистику.

### Параметры

```ts
DEFAULT_DIMENSIONS: ['m', 'm/s', 'seconds'].join(', '), // единицы измерения
MODELING_MAX_TIME: modelingTime, // время моделирования
COWS_INITIAL_SIZE: 100, // число агентов в популяции коров
COW_WIDTH_METERS: 1, // ширина коровы в метрах
COW_HEIGHT_METERS: 2, // длина коровы в метрах
COW_SPEED: 2.22, // скорость передвижения коровы
COW_WAITING_TIME: 20*60, // максимальное время отдыха
FARM_WIDTH_METERS: 100, // ширина поля фермы
FARM_HEIGHT_METERS: 100, // длина поля фермы
FARM_POSITION_X: 10, // позиция фермы x 
FARM_POSITION_Y: 10, // позиция фермы y
VIRUS_SPREAD_PROBABILITY: 0.01, // вероятность распространения вируса за одну секунду
VIRUS_INFECT_RADIUS: 3, // радиус распространения вируса
VIRUS_INCUBATION_TIME: modelingTime + 1, // длительность инкубационного периода
COVER_LOOP_TIME: 2, // интервал между сканированиями в секундах
COVER_PROOF_EVENT_COUNT: 5, // необходимое количество контактов, чтобы считаться зараженным
COVER_SPREAD_RADIUS: 3, // радиус сканирования
```

### Результаты моделирования

После настройки модели, заполнения всех параметров, создания конфигураций графиков, перейдем к запуску и сбору статистики.

В рамках работы мы провели 10 запусков модели, и собрали статистику отраженную в таблице 1.

| номер эксперимента | количество обнаружений сенсором | количество инфицированных особей | количество необнаруженных вирусов | количество ложно-положительных результатов |
| ------------------ | ------------------------------- | -------------------------------- | --------------------------------- | ------------------------------------------ |
| 1                  | 9                               | 11                               | 2                                 | 0                                          |
| 2                  | 8                               | 9                                | 1                                 | 0                                          |
| 3                  | 15                              | 15                               | 2                                 | 2                                          |
| 4                  | 15                              | 14                               | 3                                 | 4                                          |
| 5                  | 10                              | 6                                | 2                                 | 6                                          |
| 6                  | 8                               | 10                               | 3                                 | 1                                          |
| 7                  | 19                              | 16                               | 2                                 | 5                                          |
| 8                  | 14                              | 13                               | 2                                 | 3                                          |
| 9                  | 12                              | 12                               | 0                                 | 0                                          |
| 10                 | 12                              | 9                                | 0                                 | 3                                          |

Снимки экрана процесса моделирования можно найти в Приложении 1, Приложении 2.

### Расчет точности эксперимента

Математическое ожидание ошибки первого рода равно 0.1535.

## Выводы



## Приложения

### Приложение 1

![image-20241225095116713](C:\Users\turbo\AppData\Roaming\Typora\typora-user-images\image-20241225095116713.png)

Результаты одного из экспериментов.

### Приложение 2

![image-20241225095355925](C:\Users\turbo\AppData\Roaming\Typora\typora-user-images\image-20241225095355925.png)

Процесс моделирования.

### Приложение 3

![image-20241225095653836](C:\Users\turbo\AppData\Roaming\Typora\typora-user-images\image-20241225095653836.png)

Результат моделирования.
