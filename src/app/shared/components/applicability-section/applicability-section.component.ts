import {
    Component,
    Inject,
    OnInit,
    ViewEncapsulation,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseComponent } from '@core/classes/base-component';
import {DATA} from './data';

@Component({
    selector: 'owner-applicability-section',
    templateUrl: './applicability-section.component.html',
    styleUrls: ['./applicability-section.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ApplicabilitySectionComponent extends BaseComponent implements OnInit {
    public groups: any = DATA;
    public carouselItems: any = [];
    public activeSection= 0;
    public activeSlide= 0;
    public animationFlag= false;

    public constructor(@Inject(PLATFORM_ID) private _platformId: string) {
        super();
    }
    public ngOnInit(): void {
        this.activeSection= 0;
        for (let groupIndex= 0; groupIndex < this.groups.length; groupIndex++){   
            for (let j= 0; j < this.groups[groupIndex].items.length; j++) {                
                this.carouselItems.push(this.groups[groupIndex].items[j]);
            }
        }
    }
    // Function to change the animation state
    private _toggleAnimation(): void {
        if(isPlatformBrowser(this._platformId)){
            if (typeof document !== 'undefined') {
                const element = document.querySelector('.carousel-section');
                const keyframes = [
                    { opacity: 0 },
                    { opacity: 1 }
                ];
                if(element){
                    element.animate(keyframes, 1000);
                }
            }
            this.animationFlag = true;
        }
    }
    public changeSection(section: number): void {
        if(this.activeSection != section) {
            this._toggleAnimation();
           
            let slideToGo = 0;
            for (let sectionIndex= 1; sectionIndex <= section; sectionIndex++) {
                slideToGo+= this.groups[sectionIndex-1].items.length;
            }
            this.activeSection= section;
            this.activeSlide= slideToGo;
        }
    }

    public changeSlide(slide: number): void {
        if(this.activeSlide != slide) {
            this.activeSlide= slide;
        }
    }
}
