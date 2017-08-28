import { Injectable, ApplicationRef, ComponentFactoryResolver, ComponentRef } from "@angular/core";
import { Rectangle } from "./rectangle";

export interface IRuler {
    measure(element: HTMLElement): Promise<Rectangle>
}

@Injectable()
export class Ruler implements IRuler {
    constructor(private _applicationRef: ApplicationRef) {

        this.measure = this.measure.bind(this);
    }

    public measure(element: HTMLElement): Promise<Rectangle> {
        return new Promise((resolve) => {
            if (document.body.contains(element)) {
                const result = Rectangle.fromClientRect(element.getBoundingClientRect());
                resolve(result);
            } else {
                setTimeout(() => {
                    document.body.appendChild(element);
                    const clientRect = element.getBoundingClientRect();
                    element.parentNode.removeChild(element);
                    var result = Rectangle.fromClientRect(clientRect);
                    resolve(result);
                }, 0);
            }
        });        
    }

    public measureComponent(options: { componentRef: ComponentRef<any> }): Promise<Rectangle> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this._applicationRef.attachView(options.componentRef.hostView);    
                document.body.appendChild(options.componentRef.location.nativeElement);
                const clientRect = options.componentRef.location.nativeElement.getBoundingClientRect();
                options.componentRef.location.nativeElement.parentNode.removeChild(options.componentRef.location.nativeElement);
                this._applicationRef.detachView(options.componentRef.hostView);                
                var result = Rectangle.fromClientRect(clientRect);                
                resolve(result);
            }, 0);
        });
    }
}