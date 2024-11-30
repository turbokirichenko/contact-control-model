import './style.css';
import '@pixi/gif';
import { App } from './app';
import { FILL_COLOR } from './shared/constant/constants';
import { Manager } from './plugins/engine/manager';
import { IPixiApplicationOptions, PixiAssets } from './plugins/engine';
import { Loader } from './plugins/engine/loader';
import { options } from './shared/config/manifest';
import { LoaderScene } from './ui/scenes/loader.scene';
import { ModelScene } from './ui/scenes/model.scene';
import { Cow } from './entities/cow';
import { Farm } from './entities/farm';
import { ModelImpl } from './entities/model/model.impl';

const bootModel = () => {
    const farm = new Farm();
    const cow = new Cow(farm);
    const model = new ModelImpl(cow, farm);
    Manager.changeScene(new ModelScene(model));
}

const boostsrap = async () => {
    const canvas = document.getElementById("pixi-screen") as HTMLCanvasElement;
    const resizeTo = window;
    const resolution = window.devicePixelRatio || 1;
    const autoDensity = true;
    const backgroundColor = FILL_COLOR;
    const appOptions: Partial<IPixiApplicationOptions> = {
        canvas,
        resizeTo,
        resolution,
        autoDensity,
        backgroundColor
    }

    const application = new App();
    await application.init(appOptions);

    Manager.init(application);
    const loader = new Loader(PixiAssets);
    const loaderScene = new LoaderScene();
    Manager.changeScene(loaderScene);
    loader.download(options, loaderScene.progressCallback.bind(loaderScene)).then(bootModel);
}

boostsrap();
