import { Component, ApplicationRef, ComponentFactory, ComponentFactoryResolver, Injector, ComponentRef, Injectable, ReflectiveInjector } from "@angular/core";
import { BackdropComponent } from "../components/backdrop.component";
import { ModalWindowComponent } from "../components/modal-window.component";
import { ContentRef } from "./content-ref";

@Injectable()
export class ModalService {
    constructor(
        private _applicationRef: ApplicationRef,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _injector: Injector
    ) {
        this._backdropComponentFactoryResolver = _componentFactoryResolver.resolveComponentFactory(BackdropComponent);
        this._modalWindowComponentFactoryResolver = _componentFactoryResolver.resolveComponentFactory(ModalWindowComponent);
    }

    private _backdropComponentFactoryResolver: ComponentFactory<BackdropComponent>;
    private _modalWindowComponentFactoryResolver: ComponentFactory<ModalWindowComponent>;
    private _backdropComponentRef: ComponentRef<BackdropComponent>;
    private _windowComponentRef: ComponentRef<ModalWindowComponent>;

    public open(options: { content:any, injector:Injector }) {
        const containerElement = document.querySelector('body');
        const injector = options.injector || this._injector;

        this._backdropComponentRef = this._backdropComponentFactoryResolver.create(injector);
        this._applicationRef.attachView(this._backdropComponentRef.hostView);
        containerElement.appendChild(this._backdropComponentRef.location.nativeElement);

        var contentRef = this._getContentRef(this._componentFactoryResolver, injector, options.content, null);

        this._windowComponentRef = this._modalWindowComponentFactoryResolver.create(injector, contentRef.nodes);
        this._applicationRef.attachView(this._windowComponentRef.hostView);
        containerElement.appendChild(this._windowComponentRef.location.nativeElement);

    }

    private _getContentRef(
        componentFactoryResolver: ComponentFactoryResolver,
        contentInjector: Injector,
        content: any,
        activeModal: any
    ): ContentRef {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(content);
        const componentRef = componentFactory.create(contentInjector);        
        return new ContentRef([[componentRef.location.nativeElement]]);
    }

    public close() {
        this._applicationRef.detachView(this._windowComponentRef.hostView);
        this._applicationRef.detachView(this._backdropComponentRef.hostView);
        this._windowComponentRef.destroy();
        this._backdropComponentRef.destroy();        
    }
}