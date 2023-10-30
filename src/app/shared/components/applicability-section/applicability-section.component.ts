import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener, Inject,
    OnInit,
    ViewEncapsulation,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseComponent } from '@core/classes/base-component';

import { DATA } from './data';

import { register } from 'swiper/element/bundle';
import { CarouselComponent } from '../carousel/carousel.component';


@Component({
    selector: 'owner-applicability-section',
    templateUrl: './applicability-section.component.html',
    styleUrls: ['./applicability-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,

})
export class ApplicabilitySectionComponent extends BaseComponent implements OnInit {
    
    @HostListener('window:resize', ['$event'])

    public groups: any = DATA;
    public carouselItems: any = [];
    public sectionIndex= 0;
    public activeSection= 0;
    public activeSlide= 0;
    

    public constructor(public cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private _platformId: string) {
        super();
        this._detectScreenSize();
        register();
    }

    private _detectScreenSize(): void {
        if(isPlatformBrowser(this._platformId)){
            const windowWidth= window.innerWidth;
            // if (windowWidth > 1280) {
            //     this.currentConfig = EffectCarouselLarge;
            // } else {
            //     this.currentConfig = EffectCarousel;
            // }
        }
    }
    private _toggleAnimation(): void {
        const element = document.querySelector('.carousel-section');
        const keyframes = [
            { opacity: 0 },
            { opacity: 1 }
        ];
        if(element){
            element.animate(keyframes, 2000);
        }
    }
    public ngOnInit(): void {
        if (typeof document === 'undefined') return;
        this.sectionIndex= 0;
        for (let groupIndex= 0; groupIndex < this.groups.length; groupIndex++){   
            for (let j= 0; j < this.groups[groupIndex].items.length; j++) {                
                this.carouselItems.push(this.groups[groupIndex].items[j]);
            }
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
    public onResize(): void {
        this._detectScreenSize();
    }
    public changeSlide(slide: number): void {
        if(this.activeSlide != slide) this.activeSlide= slide;
    }
    
    /*
    private _initSwiper(): void {
        // for (let groupIndex = 0; groupIndex < this.groups.length; groupIndex++){   
        //     if(groupIndex) {
        //         this.groupPagesStartIndex[groupIndex] = this.groupPagesStartIndex[groupIndex-1] + this.groups[groupIndex].items.length + 1;
        //     }         
        //     else {
        //         this.groupPagesStartIndex[groupIndex] = 0;
        //     }
        //     for (let j = 0; j < this.groups[groupIndex].items.length; j++){                
        //         this.carouselItems.push({...this.groups[groupIndex].items[j], ...{groupIndex}});
        //     }
        // }
        /*
        this.swiperParams = {
            loop: true,
            // autoplay: {
            //     delay: 5000
            // },
            effect: 'creative',
            creativeEffect: {
                limitProgress: 2,
                next: {
                    translate: [90,0,0],
                    scale: .9
                },
                prev: {
                    translate: [-90,0,0],
                    scale: .9
                },
                progressMultiplier: 1.5
            },
            slidesPerView: 1,
            centeredSlides: false,
            grabCursor: false,
            speed: 500,
            slideToClickedSlide: true,
            watchSlidesProgress: true,
            modules: [Autoplay,EffectCreative],
            injectStylesUrls: [
                'swiper/element/css/autoplay',
                'swiper/element/css/effect-creative',
            ],
        };

        this.swiperEl = document.querySelector('swiper-container');
        Object.assign(this.swiperEl,this.swiperParams);
        this.swiperEl.initialize();
        this.swiperEl.swiper.on('slideChange',  (e:any) =>  {
            // this.activePageIndex = e.realIndex;
            this.activePageIndex = e.activeIndex;
            this.isBegining = e.isBeginning;
            this.isEnd = e.isEnd;
            if(this.carouselItems[this.activePageIndex].groupIndex !== this.activeGroupIndex){
                this.activeGroupIndex = this.carouselItems[this.activePageIndex].groupIndex;
                this._toggleAnimation();
            }
            this.activeGroupStartIndex = this.groupPagesStartIndex[this.activeGroupIndex];
            this.activePage = this.activePageIndex - this.activeGroupStartIndex;
            this.cdr.detectChanges();
        });
        /*
        this.slider = new Swiper('.swiper', {
            // loop: true,
            modules: [Pagination,Autoplay,EffectCoverflow],
            injectStylesUrls: [
                'swiper/element/css/pagination',
                'swiper/element/css/autoplay',
                'swiper/element/css/effect-coverflow',
            ],
            // injectStylesUrls: [
            //     'swiper/element/css/effect-fade',
            // ],
            effect: 'slide',
            slidesPerView: 1,
            // centeredSlides: true,
            // grabCursor: false,
            // speed: 500,
            // resizeObserver: true,
            slideToClickedSlide: true
        });
        this.slider.on('slideChange',  (e: any): void =>  {
            this.activePageIndex = e.realIndex;
            if(this.carouselItems[this.activePageIndex].groupIndex !== this.activeGroupIndex){
                this.activeGroupIndex = this.carouselItems[this.activePageIndex].groupIndex;
                this._toggleAnimation();
            }
            this.cdr.detectChanges();
        });
        this._setSliderInterval(3000);
    }
    /*
    private _setSliderInterval(delay: number): void{
        if(this.sliderDelay !== delay){
            if(this.sliderInterval){
                clearInterval(this.sliderInterval);
            }
            this.sliderInterval =  setInterval( () => {
                const nextIndex = this.activePageIndex + 1;
                if (nextIndex < this.carouselItems.length) {
                    this.slider.slideTo(nextIndex);
                } else {
                    this.slider.slideTo(0);
                }

            }, delay);
            this.sliderDelay = delay;
        }
    }
    // Function to change the animation state
    private _toggleAnimation(): void {
        const element = document.querySelector('.carousel-section');
        const keyframes = [
            { opacity: 0 },
            { opacity: 1 }
        ];
        if(element){
            element.animate(keyframes, 1000);
        }
    }

    public onResize(): void {
        this._detectScreenSize();
    }    
    public ngOnInit(): void {
        if (typeof document === 'undefined') return;
        
        this._initSwiper();
    }
    public mouseEnter(): void {
        this._setSliderInterval(6000);
    }
    public mouseLeave(): void{
        this._setSliderInterval(3000);
    }
    public changeActiveSlider(index: number): void{
        if(index === this.activeGroupIndex){
            return;
        }
        this.activeGroupIndex = index;
        const itemIndex = this.carouselItems.findIndex((x: any) => x.groupIndex === this.activeGroupIndex);
        this.paginate(itemIndex);
        this._toggleAnimation();
    }
    public paginate(index: any): void{
        this.slider.slideTo(index);
        this.cdr.detectChanges();
        this.sliderDelay = 0;
        this._setSliderInterval(3000);
    }
    */
}
