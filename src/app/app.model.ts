import { Cows, COWS_TOKEN } from "../entities/cows";
import { FARM_TOKEN, Farm } from "../entities/farm";
import { Virus } from "../entities/virus";
import { VIRUS_TOKEN } from "../entities/virus/virus.impl";
import { DefineModel } from "../plugins/htmodel";

@DefineModel([
    { token: COWS_TOKEN, class: Cows },
    { token: FARM_TOKEN, class: Farm },
    { token: VIRUS_TOKEN, class: Virus },
])
export class AppModel {};