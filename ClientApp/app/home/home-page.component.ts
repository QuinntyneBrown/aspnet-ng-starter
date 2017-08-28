import {Component, ElementRef} from "@angular/core";
import {PopoverService} from "../shared/services/popover.service";
import {HomePopoverComponent} from "./home-popover.component";

@Component({
    templateUrl: "./home-page.component.html",
    styleUrls: ["./home-page.component.css"],
    selector: "ce-home-page"
})
export class HomePageComponent {
    constructor(
        private _elementRef: ElementRef,
        private _popoverService: PopoverService) { }

    ngOnInit() {
        
        this._popoverService.show({
            component: HomePopoverComponent,
            target: this._elementRef.nativeElement.querySelector("p")
        });

        setTimeout(() => {
            this._popoverService.hide();
        }, 3000);
    }
}
