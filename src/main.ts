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
import { Vector2d } from './entities/math/vector2d';
import { Cows } from './entities/cows/cows.impl';

const bootModel = () => {
    var farm = new Farm();

    var cows = new Cows()
    for (var i = 0; i < 100; i++) {
        var posX = farm.position.x + Math.random()*(farm.width)
        var posY = farm.position.y + Math.random()*(farm.height);
        var position = new Vector2d(posX, posY);
        var vPosX = farm.position.x + Math.random()*(farm.width)
        var vPosY = farm.position.y + Math.random()*(farm.height);
        var destinationPoint = new Vector2d(vPosX, vPosY);
        var cow = new Cow(farm, position, destinationPoint);
        cows.push(cow);
    }

    const model = new ModelImpl(cows, farm);
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
