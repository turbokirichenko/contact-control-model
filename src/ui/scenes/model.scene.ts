import { PixiContainer,PixiGraphics, PixiTexture, PixiTilingSprite } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";
import { IAgent, IModel, IPresentation } from "../../plugins/htmodel";
import { GUIBarContainer } from "../containers/gui-bar.container";

class AgentPresentation<T extends IAgent> extends PixiContainer {
    constructor(public config: IPresentation, agent: T) {
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

const PLATO_DEFAULT_SIZE = 4000;
const PLATO_SOURCE_SIZE = 16;
export const X = {
    SCALE: 4,
    SCORE: 1
}

export class ModelScene extends PixiContainer implements SceneInterface {

    private _containersMap: Map<string, AgentPresentation<IAgent>[]> = new Map();
    private _gui: PixiContainer & SceneInterface;
    private _screen: PixiContainer;
    private _target: any = null;
    private _plato: PixiContainer;

    constructor(private readonly _model: IModel) {
        super();
        this.interactive = true;
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this.width = parentWidth;
        this.height = parentHeight;
        this._gui = new GUIBarContainer(this._model);

        this._screen = new PixiContainer();
        this._screen.interactive = true;
        const bg_texture = PixiTexture.from('pattern');
        bg_texture.source.width = PLATO_SOURCE_SIZE;
        bg_texture.source.height = PLATO_SOURCE_SIZE;
        bg_texture.update()
        const plato = new PixiTilingSprite({
            texture: bg_texture,
            width: PLATO_DEFAULT_SIZE,
            height: PLATO_DEFAULT_SIZE
        });
        plato.anchor = 0.5;
        plato.alpha = 0.10;
        this._plato = plato;
        this._screen.addChild(plato);

        this._screen.on("pointerdown", this._onStart.bind(this), this._screen);
        this.on('pointerup', this._onEnd.bind(this));
        this.on('pointerupoutside', this._onEnd.bind(this));
        this._screen.scale = X.SCALE;

        this.addChild(this._screen, this._gui);
        this.resize(parentWidth, parentHeight);
    }

    update(_framesPassed: number): void {
        for (let i = 0; i < X.SCORE; ++i) {
            this._gui.update(_framesPassed);
            this._model.tick();
        }

        this._model.instances.forEach((population, token) => {
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
                    const cowContainer = new AgentPresentation(population.presentation!, population[containers?.length ?? 0 + index]);
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

    resize(_parentWidth: number, _parentHeight: number): void {
        this._screen.position.set(0, 0);
        this._gui.resize(_parentWidth, _parentHeight);
        this._gui.position.x = _parentWidth - this._gui.width;
        this._gui.position.y = 0;

        this._plato.position.set((_parentWidth - this._gui.width)/2, (_parentHeight)/2);
    }

    private _onMove(event: PointerEvent) {
        if (this._target) {
            var [x, y] = [this._target.position.x, this._target.position.y]
            if (Math.abs(x + event.movementX) > 2000 || Math.abs(y + event.movementY) > 2000) {
                return;
            }
            this._target.position.set(
                x + event.movementX,
                y + event.movementY,
            );
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