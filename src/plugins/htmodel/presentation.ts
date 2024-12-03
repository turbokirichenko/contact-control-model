import { IModel, IAgent } from ".";

export type PresentationRule<T, R> = ((target: T, model: IModel, ...args: any[]) => R) | R;
export interface PresentationConfig<T extends IAgent> {
    anchor?: PresentationRule<T, number>;
    width?: PresentationRule<T, number>;
    height?: PresentationRule<T, number>;
    alias?: PresentationRule<T, string>;
    fill?: PresentationRule<T, string | number>;
    position?: PresentationRule<T, [number, number]>;
    direction?: PresentationRule<T, number>;
}
export function Presentation<T extends IAgent>(_config: PresentationConfig<T>) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {}
    }
}