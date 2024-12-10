import { PixiContainer } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";
import { model } from "../../plugins/htmodel/model.example";

export class ExampleScene extends PixiContainer implements SceneInterface {

    constructor() {
        super();
        model.cows.create(100);
        model.virus.create(100);
    }

    update(_framesPassed: number): void {
        for (let i = 0; i < 10; ++i) {
            model.bootstrap.cow();
            model.bootstrap.virus();
        }

        /*this._model.instances.forEach((population, token) => {
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
        });*/
    }

    resize(_w: number, _h: number): void {}

    /*private _onMove(event: PointerEvent) {
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
    }*/
}