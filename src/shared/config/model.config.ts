import { IModelConfig, IModel } from "../../plugins/htmodel/main";
import { CommonActions } from "../../model/actions/common.actions";
import { FARMS_TOKEN, COWS_TOKEN, VIRUSES_TOKEN, Cow, Farm, Virus } from "../../model/populations";
import { Cover, COVERS_TOKEN, Signal, SIGNALS_TOKEN } from "../../model/populations/cover";

export const modelConfig: IModelConfig = {
    globals: {
        DEFAULT_DIMENSIONS: ['m', 'm/s', 'seconds'].join(', '),
        COWS_INITIAL_SIZE: 100,
        COW_WIDTH_METERS: 1,
        COW_HEIGHT_METERS: 2,
        COW_SPEED: 2.22,
        COW_WAITING_TIME: 20*60,
        FARM_WIDTH_METERS: 100,
        FARM_HEIGHT_METERS: 100,
        FARM_POSITION_X: 10,
        FARM_POSITION_Y: 10,
        VIRUS_SPREAD_PROBABILITY: 0.01,
        VIRUS_INFECT_RADIUS: 3,
        VIRUS_INCUBATION_TIME: 60*60*4,
        COVER_LOOP_TIME: 10,
        COVER_PROOF_EVENT_COUNT: 5,
        COVER_SPREAD_RADIUS: 2.55,
    },
    actions: [
        { token: CommonActions.name, useCLass: CommonActions },
    ],
    charts: [
        {
            token: 'virusPopulationInTime',
            type: 'plot',
            datasets: [
                { 
                    title: 'cow population',
                    capacity: 8000,
                    color: 'red',
                    measure: (_model: IModel) => {
                        return _model.use(COWS_TOKEN)?.size ?? 0;
                    }
                },
                { 
                    title: 'virus population',
                    capacity: 8000,
                    color: 'teal',
                    measure: (_model: IModel) => {
                        return _model.use(VIRUSES_TOKEN)?.size ?? 0;
                    }
                },
                { 
                    title: 'virus incubation period',
                    capacity: 8000,
                    color: 'orange',
                    measure: (_model: IModel) => {
                        var count = 0;
                        _model.use<Virus>(VIRUSES_TOKEN)?.ask(virus => virus.period === 'incubation' && count++);
                        return count;
                    }
                },
                { 
                    title: 'virus active period',
                    capacity: 8000,
                    color: 'green',
                    measure: (_model: IModel) => {
                        var count = 0;
                        _model.use<Virus>(VIRUSES_TOKEN)?.ask(virus => virus.period === 'active' && count++);
                        return count;
                    }
                },
            ]
        },
        {
            token: 'virusPopulationToTime',
            type: 'histogram',
            datasets: [
                { 
                    title: 'cow population',
                    capacity: 1,
                    color: 'red',
                    measure: (_model: IModel) => {
                        return _model.use(COWS_TOKEN)?.size ?? 0;
                    }
                },
                {
                    title: 'wellness cow population',
                    capacity: 1,
                    color: 'green',
                    measure: (_model: IModel) => {
                        return (_model.use(COWS_TOKEN)?.size ?? 0) - (_model.use(VIRUSES_TOKEN)?.size ?? 0);
                    }
                },
                { 
                    title: 'virus population',
                    capacity: 1,
                    color: 'teal',
                    measure: (_model: IModel) => {
                        return _model.use(VIRUSES_TOKEN)?.size ?? 0;
                    }
                },
            ]
        },
    ],
    populations: [
        { 
            token: FARMS_TOKEN, 
            useClass: Farm,
            presentation: {
                container: (farm: Farm) => ({
                    width: farm.width,
                    height: farm.height,
                    positionX: farm.position.x,
                    positionY: farm.position.y,
                    fill: 'lightgreen',
                    opacity: 0.9
                }),
                position: () => ({ x: 0, y: 0 }),
                direction: () => 0,
                zIndex: () => 0
            }
        },
        { 
            token: COWS_TOKEN, 
            useClass: Cow, 
            presentation: {
                container: (cow: Cow) => ({
                    width: cow.width,
                    height: cow.height,
                    positionX: -0.5*cow.width,
                    positionY: -0.5*cow.height,
                    fill: 'black',
                }),
                position: (cow: Cow) => ({
                    x: (cow.position.x ?? 0),
                    y: (cow.position.y ?? 0),
                }),
                direction: (cow: Cow) => cow.direction,
                zIndex: (_cow: Cow) => 0
            }
        },
        {
            token: VIRUSES_TOKEN,
            useClass: Virus,
            presentation: {
                container: (virus: Virus) => ({
                    width: virus.infectZone,
                    height: virus.infectZone,
                    fill:  (virus.period === 'active') ? 'green' : 'yellow',
                    type: 'circle',
                    opacity: 0.33
                }),
                position: (virus: Virus) => ({
                    x: (virus.infected?.position.x ?? 0),
                    y: (virus.infected?.position.y ?? 0),
                }),
                direction: () => 0,
                zIndex: () => 0,
            }
        },
        {
            token: SIGNALS_TOKEN,
            useClass: Signal,
        },
        {
            token: COVERS_TOKEN,
            useClass: Cover,
            presentation: {
                container: (cover: Cover) => ({
                    width: 1,
                    height: 1,
                    fill:  'black',
                    type: 'circle',
                    opacity: 0.8
                }),
                position: (cover: Cover) => {
                    console.log(cover);
                    return ({
                        x: (cover.cow?.position.x ?? 0),
                        y: (cover.cow?.position.y ?? 0),
                    })
                },
                direction: () => 0,
                zIndex: () => 0,
            }
        }
    ]
}