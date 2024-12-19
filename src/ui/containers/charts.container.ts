import { IChart, IModel } from "../../plugins/htmodel/main";
import { PixiContainer, PixiGraphics } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";

export class ChartContainer extends PixiContainer implements SceneInterface {
    private readonly _bg: PixiGraphics;
    private readonly _line: PixiGraphics;

    constructor(private readonly _chart: IChart) {
        super();
        this._bg = new PixiGraphics();
        this._bg
            .rect(0, 0, 280, 280)
            .fill(0xfdf4e3)
            .stroke({ color: 0x222222, width: 4 });
        this._line = new PixiGraphics();
        this.addChild(this._bg, this._line);
    }

    public update(_f: number) {
        this._chart.datasets.forEach(sets => {
            this._line.clear();
            sets.update();
            var len = sets.data.length;
            var maxValue = 100;
            var maxTimes = 1000;
            var points: {x: number, y: number}[] = [];
            sets.data.map((num, i) => {
                if (len - i <= maxTimes) {
                    var x = (maxTimes - (len - i))/maxTimes*280;
                    var y = 280 - (num/maxValue)*280;
                    points.push({x, y})
                }
            })
            this._line.poly(points, false).stroke({ width: 3, color: 'black' });
        });
    }

    public resize(_w: number, _h: number) {

    }
}

export class ChartsContainer extends PixiContainer implements SceneInterface {
    private readonly _charts: ChartContainer[] = [];

    constructor(_model: IModel) {
        super();
        _model.charts.forEach((value) => {
            this._charts.push(new ChartContainer(value))
        });
        this.addChild(...this._charts);
    }

    public update(_framesPassed: number): void {
        this._charts.map(chart => chart.update(_framesPassed));
    }

    public resize(_screenWidth: number, _screenHeight: number): void {
        var padding = 10;
        var gap = 10;
        var yLength = 0;
        this._charts.forEach(container => {
            container.x = padding;
            container.y = yLength + padding;
            yLength += (container.height + gap);
        });
    }
}