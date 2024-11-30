export interface Vector2dInterface {
    x: number;
    y: number;
    calcInterval(vect: Vector2dInterface): number;
    shift(vect: Vector2dInterface, multiplex?: number): Vector2dInterface;
    direction(vect: Vector2dInterface): number;
}