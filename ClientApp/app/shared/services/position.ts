import { Injectable, ComponentRef } from "@angular/core";
import { Space } from "./space";
import { Rectangle } from "./rectangle";
import { Ruler } from "./ruler";
import { translateXY } from "../utilities/translate-xy";

@Injectable()
export class Position {
    constructor(
        private _ruler: Ruler,
        private _space: Space
    ) { }

    public somewhere = (a: HTMLElement, b: HTMLElement, space: number, directionPriorityList: Array<string>) => {
        return new Promise(() => {
            throw new Error("");
        });
    }

    public top(a: HTMLElement, b: HTMLElement, space: number): Promise<any> {
        return new Promise(resolve => {
            Promise.all([this._ruler.measure(a), this._ruler.measure(b)])
                .then((resultsArray: Array<Rectangle>) => {
                    var rectangleA = resultsArray[0];
                    var rectangleB = resultsArray[1];
                    translateXY(b, rectangleA.centerX - rectangleB.radiusX, rectangleA.bottom + space);
                    resolve();
                });            
        });
    }

    public right(a: HTMLElement, b: HTMLElement, space: number): Promise<any> {
        return new Promise(resolve => {
            Promise.all([this._ruler.measure(a), this._ruler.measure(b)])
                .then((resultsArray: Array<Rectangle>) => {
                    resolve();
                });
        });
    }

    public bottom(options: { componentRef: ComponentRef<any>, target: HTMLElement, space: number}): Promise<any> {
        return new Promise(resolve => {
            Promise.all([this._ruler.measure(options.target), this._ruler.measureComponent({ componentRef: options.componentRef })])
                .then((resultsArray: Array<Rectangle>) => {                    
                    var targetRectangle = resultsArray[0];
                    var componentRectangle = resultsArray[1];
                    translateXY(options.componentRef.location.nativeElement, targetRectangle.centerX - componentRectangle.radiusX, targetRectangle.bottom + options.space);
                    resolve();
                });  
        });
    }

    public left(a: HTMLElement, b: HTMLElement, space: number): Promise<any> {
        return new Promise(resolve => {
            Promise.all([this._ruler.measure(a), this._ruler.measure(b)])
                .then((resultsArray: Array<Rectangle>) => {
                    resolve();
                });
        });
    }
}