import { Cow, COW_TOKEN, ICow } from "../../entities/cow";
import { Farm, FARM_TOKEN, IFarm } from "../../entities/farm";
import { VIRUS_SPAWNER_TOKEN, VirusSpawner } from "../../entities/spawner/spawner";
import { IVirus, Virus } from "../../entities/virus";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";
import { ModelConfig } from "../../plugins/htmodel";

export const modelConfig: ModelConfig = {
    [COW_TOKEN]: {
        useClass: Cow,
        size: 100,
        presentation: {
            container: (cow: ICow) => ({
                width: cow.width,
                height: cow.height,
                positionX: -0.5*cow.width,
                positionY: -0.5*cow.height,
                fill: 'brown'
            }),
            position: (cow: ICow) => ({
                x: (cow.getPosition().x ?? 0),
                y: (cow.getPosition().y ?? 0),
            }),
            direction: (cow: ICow) => cow.getDirection(),
            zIndex: (_cow: ICow) => 0
        }
    },
    [FARM_TOKEN]: {
        useClass: Farm,
        size: 1,
        presentation: {
            container: (farm: IFarm) => ({
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
    [VIRUS_TOKEN]: {
        useClass: Virus,
        size: 0,
        presentation: {
            container: (virus: IVirus<ICow>) => ({
                width: virus.radius,
                height: virus.radius,
                fill: 'green',
                type: 'circle',
                opacity: 0.5
            }),
            position: (virus: IVirus<ICow>) => ({
                x: (virus.infected?.getPosition().x ?? 0),
                y: (virus.infected?.getPosition().y ?? 0),
            }),
            direction: () => 0,
            zIndex: () => 0,
        }
    },
    [VIRUS_SPAWNER_TOKEN]: {
        useClass: VirusSpawner,
        size: 1
    }
}