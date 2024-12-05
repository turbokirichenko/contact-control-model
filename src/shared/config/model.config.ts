import { Cow, COW_TOKEN } from "../../entities/cow";
import { Farm, FARM_TOKEN } from "../../entities/farm";
import { VIRUS_SPAWNER_TOKEN, VirusSpawner } from "../../entities/spawner/spawner";
import { Virus } from "../../entities/virus";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";
import { ModelConfig } from "../../plugins/htmodel";

export const modelConfig: ModelConfig = {
    [COW_TOKEN]: {
        useClass: Cow,
        size: 200,
    },
    [FARM_TOKEN]: {
        useClass: Farm,
    },
    [VIRUS_TOKEN]: {
        useClass: Virus,
        size: 0,
    },
    [VIRUS_SPAWNER_TOKEN]: {
        useClass: VirusSpawner,
        size: 10
    }
}