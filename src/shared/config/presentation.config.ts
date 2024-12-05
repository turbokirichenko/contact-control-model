import { PresentationConfig } from "../../plugins/htmodel";
import { PixiGraphics } from "../../plugins/engine";
import type { ICow } from "../../entities/cow";
import type { IVirus } from "../../entities/virus";
import { COW_TOKEN } from "../../entities/cow";
import { VIRUS_TOKEN } from "../../entities/virus/virus.impl";

export const X_SCALE = 4;
export const X_SCORE = 1;

var virusPConfig: PresentationConfig<PixiGraphics, IVirus<ICow>> = {
    token: VIRUS_TOKEN,
    graphic: () => {
        var virusG = new PixiGraphics({ alpha: 0.5 });
        return virusG.circle(0,0,4).fill('green');
    },
    position: (virus: IVirus<ICow>) => ({
        x: (virus.infected?.getPosition().x ?? 0)*X_SCALE,
        y: (virus.infected?.getPosition().y ?? 0)*X_SCALE,
    }),
    direction: () => undefined
}
var cowPConfig: PresentationConfig<PixiGraphics, ICow> = {
    token: COW_TOKEN,
    graphic: () => {
        var cowG = new PixiGraphics();
        return cowG.rect(-1/2, -1, 1, 2).fill('gray');
    },
    position: (cow: ICow) => ({
        x: (cow.getPosition().x ?? 0)*X_SCALE,
        y: (cow.getPosition().y ?? 0)*X_SCALE,
    }),
    direction: (cow: ICow) => cow.getDirection()
}

export const presentationConfig = [virusPConfig, cowPConfig];