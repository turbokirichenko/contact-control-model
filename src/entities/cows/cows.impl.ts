import { CowInterface } from "../cow/cow.interface";
import { Cow } from "../cow";
import { Population } from "../../plugins/htmodel";

const INITIAL_NUMBER = 100;
export const COWS_TOKEN = 'cows';

export class Cows extends Population<CowInterface> {
    constructor() {
        super(Cow, INITIAL_NUMBER);
    };
}