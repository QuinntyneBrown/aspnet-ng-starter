import { Injectable, ApplicationRef, ComponentFactoryResolver, ComponentFactory, Injector, ComponentRef } from "@angular/core";

export interface IPopoverService {

}


@Injectable()
export class PopoverService implements IPopoverService {
    constructor(
        private _applicationRef: ApplicationRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _injector: Injector
    ) { }

    private _componentFactory: ComponentFactory<any>;
    private _componentRef: ComponentRef<any>;

    public show(options: { component: any }): Promise<any> {
        const containerElement = document.querySelector('body');
        this._componentFactory = this._componentFactoryResolver.resolveComponentFactory(options.component);

        return new Promise((resolve) => {

        });
    }

    public hide(): Promise<any> {
        return new Promise((resolve) => {
            this._applicationRef.detachView(this._componentRef.hostView);
            this._componentRef.destroy();
        });
    }

    private setInitialCss = () => {
        this.nativeElement.setAttribute("style", `-webkit-transition: opacity ${this.transitionDurationInMilliseconds}ms ease-in-out;-o-transition: opacity ${this.transitionDurationInMilliseconds}ms ease-in-out;transition: opacity ${this.transitionDurationInMilliseconds}ms ease-in-out;`);
        this.nativeElement.style.opacity = "0";
        this.nativeElement.style.position = "fixed";
        this.nativeElement.style.top = "0";
        this.nativeElement.style.left = "0";
        this.nativeElement.style.display = "block";
    }

    public transitionDurationInMilliseconds: number;

    public nativeElement: HTMLElement;

    public templateHTML: string;
}