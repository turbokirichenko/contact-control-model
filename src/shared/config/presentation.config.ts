import { IAgent } from "../../plugins/htmodel";
import { PixiGraphics } from "../../plugins/engine";
import type { ICow } from "../../entities/cow";
import type { IVirus } from "../../entities/virus";
import { COW_TOKEN } from "../../entities/cow";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";
import { FARM_TOKEN, IFarm } from "../../entities/farm";

export interface PresentationConfig<V, T extends IAgent> {
    token: string;
    graphic: () => V;
    position: (target: T) => { x: number, y: number };
    direction: (target: T) => number | undefined;
}

export const X_SCALE = 4;
export const X_SCORE = 1;

const virusPConfig: PresentationConfig<PixiGraphics, IVirus<ICow>> = {
    token: VIRUS_TOKEN,
    graphic: () => {
        var virusG = new PixiGraphics({ alpha: 0.5 });
        return virusG.circle(0,0,4).fill('green');
    },
    position: (virus: IVirus<ICow>) => ({
        x: (virus.infected?.getPosition().x ?? 0),
        y: (virus.infected?.getPosition().y ?? 0),
    }),
    direction: () => undefined
}
const cowPConfig: PresentationConfig<PixiGraphics, ICow> = {
    token: COW_TOKEN,
    graphic: () => {
        var cowG = new PixiGraphics();
        return cowG.rect(-1/2, -1, 1, 2).fill('black');
    },
    position: (cow: ICow) => ({
        x: (cow.getPosition().x ?? 0),
        y: (cow.getPosition().y ?? 0),
    }),
    direction: (cow: ICow) => cow.getDirection()
}
const farmPresentation: PresentationConfig<PixiGraphics, IFarm> = {
    token: FARM_TOKEN,
    graphic: () => {
        var bg = new PixiGraphics({ alpha: 0.9 });
        return bg.rect(0, 0, 150, 150).fill('lightgreen');
    },
    position: () => ({ x: 0, y: 0}),
    direction: () => undefined
}

export const presentationConfig = [
    farmPresentation, 
    cowPConfig, 
    virusPConfig
];