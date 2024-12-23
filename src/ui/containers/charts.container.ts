import { IChart, IModel } from "../../plugins/htmodel/main";
import { PixiContainer, PixiGraphics, PixiText } from "../../plugins/engine";
import { SceneInterface } from "../../plugins/engine/manager";

export class ChartContainer extends PixiContainer implements SceneInterface {
    private readonly _bg: PixiGraphics;
    private readonly _bglineX: PixiGraphics;
    private readonly _bglineY: PixiGraphics;
    private readonly _colorTitles: PixiGraphics[] = [];
    private readonly _titles: PixiText[] = [];
    private readonly _lines: PixiGraphics[];

    constructor(private readonly _chart: IChart) {
        super();
        this._bg = new PixiGraphics();
        this._bg
            .rect(0, 0, 280, 280)
            .fill(0xfdf4e3, 0)
            .stroke({ color: 0x222222, width: 4 });

        this._bglineY = new PixiGraphics();
        this._bglineY.position.set(20, 200);
        this._bglineY.lineTo(0, -180).stroke({width: 2, color: 'black'});
        this._bglineX = new PixiGraphics();
        this._bglineX.position.set(30, 210);
        this._bglineX.lineTo(230, 0).stroke({ width: 2, color: 'black' });

        var i = 0;
        this._chart.datasets.forEach(value => {
            var text = new PixiText({text: value.title, style: {
                fontSize: 11,
                lineHeight: 12,
            }});
            text.position.set(30 + 120*Number(Boolean(i >= 4)), 218 + (i%4)*16);
            text.anchor.set(0, 0.3);
            this._titles.push(text);
            var rect = new PixiGraphics();
            rect.position.set(20 + 120*Number(Boolean(i >= 4)), 218 + (i%4)*16);
            rect.rect(0, 0, 8, 8).fill(value.color);
            this._colorTitles.push(rect);
            i++;
        })

        this._lines = Array(_chart.datasets.size).fill({}).map<PixiGraphics>((_) => new PixiGraphics());
        this.addChild(this._bglineX, this._bglineY, ...this._lines, this._bg, ...this._titles, ...this._colorTitles);
    }

    public update(_f: number) {
        var i = 0;
        var chartLen = this._chart.datasets.size;
        var maxValue = 100;
        this._chart.datasets.forEach(sets => {
            var line = this._lines[i];
            line.clear();
            line.position.set(30, 200);
            if (this._chart.type === 'plot') {
                var len = sets.data.length;
                var maxTimes = sets.data.length;
                sets.data.map((num, i) => {
                    var x = (maxTimes - (len - i))/maxTimes*230;
                    var y = -(num/maxValue)*180;
                    line.lineTo(x,y);
                });
                line.stroke({ 
                    width: 2, 
                    color: sets.color
                });
            } else {
                var gap = 10;
                var len = sets.data.length;
                var value = (sets.data[len - 1]/maxValue)*180;
                var width = Math.min((230 - 10*chartLen)/chartLen, 70);
                var shift = i*(width + gap);
                line.rect(shift, -value, width, value).fill(sets.color);
            }
            ++i;
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