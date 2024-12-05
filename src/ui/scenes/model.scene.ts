import { COW_TOKEN } from "../../entities/cow";
import { PixiContainer,PixiGraphics, PixiText } from "../../plugins/engine";
import { Manager, SceneInterface } from "../../plugins/engine/manager";
import { IAgent, IModel, PresentationConfig } from "../../plugins/htmodel";
import { X_SCORE, X_SCALE, presentationConfig } from "../../shared/config/presentation.config";

class AgentPresentation<T extends IAgent> extends PixiContainer {
    constructor(public config: PresentationConfig<PixiGraphics, T>) {
        super();
        this.scale = X_SCALE;
        this.addChild(config.graphic());
    }
}

export class ModelScene extends PixiContainer implements SceneInterface {

    private _containersMap: Map<string, AgentPresentation<IAgent>[]> = new Map();
    private _presentation: PresentationConfig<PixiGraphics, any>[];
    private _text: PixiText = new PixiText({ text: 'time passed: ', style: { fontSize: '24px', fill: 'red' }});
    private secondCounter = 0;

    constructor(private readonly _model: IModel) {
        super();
        this.position.x = 0;
        this.position.y = 0;
        const parentWidth = Manager.width;
        const parentHeight = Manager.height;
        this.width = parentWidth;
        this.height = parentHeight;

        this._presentation = [...presentationConfig];

        this._text.position.x = parentWidth/2;
        this._text.position.y = parentHeight/2;
        this._text.anchor = 0.5;
        this.addChild(this._text);
    }

    update(_framesPassed: number): void {
        for (let i = 0; i < X_SCORE; ++i) {
            this.secondCounter++;
            this._model.tick();

            this._presentation.map(slide => {
                var population = this._model.getInstance(slide.token);
                if (!this._containersMap.has(slide.token)) {
                    this._containersMap.set(slide.token, []);
                }
                var containers = this._containersMap.get(slide.token);
                if (containers && population.size > containers.length) {
                    var insertSize = population.size - containers?.length;
                    if (insertSize === 0) {
                        return;
                    }
                    var insertContainers = Array(insertSize).fill(0).map(_ => {
                        const cowContainer = new AgentPresentation(slide);
                        return cowContainer;
                    });
                    if (insertContainers.length) {
                        this.addChild(...insertContainers);
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
        this._text.text = `time passed: ${Math.floor(this.secondCounter/(60*60))} hours, ${Math.floor(this.secondCounter/60%60)} min, cow size: ${this._model.getInstance(COW_TOKEN).size}`
    }

    resize(_parentWidth: number, _parentHeight: number): void {}
}