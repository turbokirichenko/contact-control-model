import { Cow, COW_TOKEN } from "../../entities/cow";
import { Farm, FARM_TOKEN } from "../../entities/farm";
import { Virus } from "../../entities/virus";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";
import { ModelConfig } from "../../plugins/htmodel";

export const modelConfig: ModelConfig = {
    [COW_TOKEN]: {
        useClass: Cow,
        size: 100,
    },
    [FARM_TOKEN]: {
        useClass: Farm,
    },
    [VIRUS_TOKEN]: {
        useClass: Virus,
    },
}