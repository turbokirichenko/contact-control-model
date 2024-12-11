import { IModelConfig } from "../../plugins/htmodel/main";
import { CommonActions } from "../../model/actions/common.actions";
import { FARMS_TOKEN, COWS_TOKEN, VIRUSES_TOKEN, Cow, Farm, Virus } from "../../model/populations";

export const modelExpantionConfig: IModelConfig = {
    globals: {
        COWS_INITIAL_SIZE: 99,
        COW_WIDTH_METERS: 1,
        COW_HEIGHT_METERS: 2,
        COW_SPEED: 2,
        COW_WAITING_TIME: 20*60,
        FARM_WIDTH_METERS: 150,
        FARM_HEIGHT_METERS: 150,
        FARM_POSITION_X: 0,
        FARM_POSITION_Y: 0,
        VIRUS_SPREAD_PROBABILITY: 0.001,
        VIRUS_INFECT_RADIUS: 3,
    },
    actions: [
        { token: CommonActions.name, useCLass: CommonActions },
    ],
    populations: [
        { 
            token: FARMS_TOKEN, 
            useClass: Farm,
            presentation: {
                container: (farm: Farm) => ({
                    width: farm.width,
                    height: farm.height,
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
                    fill: Math.random()*0xffffff,
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
                    fill: 'green',
                    type: 'circle',
                    opacity: 0.5
                }),
                position: (virus: Virus) => ({
                    x: (virus.infected?.position.x ?? 0),
                    y: (virus.infected?.position.y ?? 0),
                }),
                direction: () => 0,
                zIndex: () => 0,
            }
        }
    ]
}