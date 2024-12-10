import { IModel, ModelSpawner } from "./main";

export class cow {
    public cow = 'cows';
    private _count: number;
    constructor() {
        this._count = 0;
    }

    public tick() {
        this._count = ++this._count%1000000;
    }
}

export class virus {
    public virus = 'virus';
    private _count: number;
    constructor() {
        this._count = 0;
    }

    public tick() {
        this._count = ++this._count%1000000;
    }
}

class SetupActions {
    constructor(private readonly _model: IModel) {}
    [key: string]: any;

    setup() {
        console.log(this._model);
    }

    reset() {
        console.log('reset');
    }
}


class BootstrapActions {
    constructor(private readonly _model: IModel) {}
    [key: string]: any;

    cow() {
        this._model.use<cow>('cows')?.ask(target => {
            target.tick();
        });
    }

    virus() {
        this._model.use<virus>('virus')?.ask(target => {
            target.tick();
        })
    }
}

export const model = ModelSpawner.define({
    globals: {},
    actions: [
        { token: 'startup', useCLass: SetupActions },
        { token: 'bootstrap', useCLass: BootstrapActions },
    ],
    populations: [
        { token: 'cows', useClass: cow },
        { token: 'virus', useClass: virus }
    ]
});