import { PixiContainer, PixiGraphics, PixiTilingSprite, PixiTexture } from "../../plugins/engine";
import { Manager } from "../../plugins/engine/manager";
import { SceneInterface } from "../../plugins/engine/manager";
import { GUIContainer } from "../containers/gui.container";
import { IModel, IPresentation } from "../../plugins/htmodel/main";

class Presentation<T> extends PixiContainer {
    constructor(public config: IPresentation<T>, agent: T) {
        super();
        const container = config.container(agent);
        const graphic = new PixiGraphics()
        if (container.type === 'circle') {
            graphic.circle(0, 0, container.width)
        } else {
            graphic.rect(
                container.positionX ?? 0, 
                container.positionY ?? 0, 
                container.width, 
                container.height
            );
        }
        graphic.fill(container.fill);
        graphic.alpha = container.opacity ?? graphic.alpha;
        this.addChild(graphic);
    }
}

const SCENE_CONSTANTS = {
    BG_TEXTURE_PATTERN: 'pattern',
    PLATO_DEFAULT_SIZE: 4000,
    PLATO_SOURCE_SIZE: 20,
    PLATO_ANCHOR: 0.5,
    PLATO_ALPHA: 0.1,
}

const SCENE_CONFIG = {
    SCALE: 4,
    SPEED: 1,
}

const EVENTS = {
    POINTERDOWN: 'pointerdown',
    POINTERUP: 'pointerup',
    POINTERUPOUTSIDE: 'pointerupoutside'
}

export class ExampleScene extends PixiContainer implements SceneInterface {
    private _gui: GUIContainer;
    private _containersMap: Map<string, Presentation<any>[]>;
    private _screen: PixiContainer;
    private _target: PixiContainer | null;
    private _plato: PixiContainer;
    private _commandsQueue: (() => void)[] = [];

    constructor(private readonly _model: IModel) {
        super();
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this._containersMap = new Map();
        this._gui = new GUIContainer(this._model, this._commandsQueue);

        const bg_texture = PixiTexture.from(SCENE_CONSTANTS.BG_TEXTURE_PATTERN);
        bg_texture.source.width = SCENE_CONSTANTS.PLATO_SOURCE_SIZE;
        bg_texture.source.height = SCENE_CONSTANTS.PLATO_SOURCE_SIZE;
        bg_texture.update()
        const plato = new PixiTilingSprite({
            texture: bg_texture,
            width: SCENE_CONSTANTS.PLATO_DEFAULT_SIZE,
            height: SCENE_CONSTANTS.PLATO_DEFAULT_SIZE
        });
        plato.anchor = SCENE_CONSTANTS.PLATO_ANCHOR;
        plato.alpha = SCENE_CONSTANTS.PLATO_ALPHA;

        this._target = null;
        this._screen = new PixiContainer();
        this._screen.scale.set(SCENE_CONFIG.SCALE);
        this._plato = plato;
        this._screen.addChild(this._plato);

        this.addChild(this._screen, this._gui);
        this.resize(parentWidth, parentHeight);

        this.interactive = true;
        this._screen.interactive = true;
        this._screen.on(EVENTS.POINTERDOWN, this._onStart.bind(this), this._screen);
        this.on(EVENTS.POINTERUP, this._onEnd.bind(this));
        this.on(EVENTS.POINTERUPOUTSIDE, this._onEnd.bind(this));
    }

    update(_framesPassed: number): void {
        while(this._commandsQueue.length) {
            var command = this._commandsQueue.shift();
            if (command) {
                command();
            }
        }
        this._model.populations.forEach((population, token) => {
            if (!population.presentation) {
                return;
            }
            if (!this._containersMap.has(token)) {
                this._containersMap.set(token, []);
            }
            var containers = this._containersMap.get(token);
            if (containers && population.size > containers.length) {
                var insertSize = population.size - containers?.length;
                if (insertSize === 0) {
                    return;
                }
                var insertContainers = Array(insertSize).fill(0).map((_, index) => {
                    const cowContainer = new Presentation(population.presentation!, population[containers?.length ?? 0 + index]);
                    return cowContainer;
                });
                if (insertContainers.length) {
                    this._screen.addChild(...insertContainers);
                    containers.push(...insertContainers);
                };
            }
            if (containers) {
                containers.map((container, index) => {
                    container.renderable = false;
                    if (population[index]) {
                        var agent = population[index];
                        var vect = container.config.position(agent);
                        var dirc = container.config.direction(agent);
                        container.position.set(vect.x, vect.y);
                        container.rotation = dirc ?? container.rotation;
                        container.renderable = true;
                    }
                })
            }
        });
    }

    resize(_w: number, _h: number): void {
        this._gui.resize(_w, _h);
        this._gui.position.x = _w - this._gui.width;
        this._gui.position.y = 0;
    }

    private _onMove(event: PointerEvent) {
        if (this._target) {
            var [x, y] = [this._target.position.x, this._target.position.y]
            if (
                Math.abs(x + event.movementX) < SCENE_CONSTANTS.PLATO_DEFAULT_SIZE/2 &&
                Math.abs(y + event.movementY) < SCENE_CONSTANTS.PLATO_DEFAULT_SIZE/2) 
            {
                this._target.position.set(
                    x + event.movementX,
                    y + event.movementY,
                );
            }
        }
    }
    private _onEnd() {
        if (this._target) {
            this.off('pointermove', this._onMove);
            this._target = null;
        }
    }
    private  _onStart() {
        this._target = this._screen;
        this.on("pointermove", this._onMove);
    }
}