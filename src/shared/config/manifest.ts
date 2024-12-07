import type { LoaderOptions } from "../../plugins/engine/loader";

export const options: LoaderOptions = {
    manifest: {
        bundles: [
            {
                name: "logo",
                assets: {
                    "vite-logo": "logo/vite-logo.png",
                    "ts-logo": "logo/ts-logo.png",
                    "pixi-logo": "logo/pixi-logo.png"
                }
            },
            {
                name: "sound",
                assets: {
                    "forklift-effect": "sound/forklift-effect.wav",
                    "sound-gif": "sound/sound-gif.gif"
                }
            },
            {
                name: "scene",
                assets: {
                    "pattern": "scene/pattern.png",
                }
            }
        ]
    }
}