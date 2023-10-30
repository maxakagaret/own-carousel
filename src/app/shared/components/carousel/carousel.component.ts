import { ChangeDetectionStrategy, Component, OnInit, OnDestroy,Input, Output, EventEmitter } from '@angular/core';
// import { DATA } from '../applicability-section/data';

@Component({
  selector: 'owner-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent extends Component implements OnInit, OnDestroy {
  @Input() public carouselItems: any= [];
  @Input() public set activeSlideChange(edit: number) {
    this._changeSlideTo(edit);
  }
  @Output() public activeSectionToParent= new EventEmitter<number>();
  @Output() public activeSlideToParent= new EventEmitter<number>();

  private _swipeCoord: [number,number]= [0,0];
  private _swipeTime= 0;
  private _autoPlayInterval: any;
  private _autoPlayDelay= 3000;
  private _changeSlideBlocker= false;

  public slidersSet: any[]= [];
  public activeSlide= 0;
  public currentSection= 0;
  public activePage= 0;
  public sectionsIndexes: any[]= [];
  public sectionsSize: any[]= [];  

  private _autoPlay(): void {
    if(this._autoPlayInterval) {
      clearInterval(this._autoPlayInterval);
    }
    this._autoPlayInterval =  setInterval( ()=> this._changeSlide(true), this._autoPlayDelay);
  }
  private _changeSlide(direction:boolean ):void {
    if(direction) {
      if (this.activeSlide < this.slidersSet.length-1) {
        this.activeSlide++;
        if(this.activeSlide > this.sectionsIndexes[this.currentSection].end) {
          this.currentSection++;
        } 
      }
      else {
        this.activeSlide= 0;
        this.currentSection= 0;
      }
    }
    else {
      if (this.activeSlide > 0) {
        if(this.activeSlide == this.sectionsIndexes[this.currentSection].start) {
          this.currentSection--;
        }
        this.activeSlide--;
      }
      else {
        this.activeSlide= this.slidersSet.length-1;
        this.currentSection= this.sectionsIndexes.length-1;
      }
    }
    this.activeSectionToParent.emit(this.currentSection);
    this.activeSlideToParent.emit(this.activeSlide);
    this.activePage = 0;
    this.activePage = this.activeSlide - this.sectionsIndexes[this.currentSection].start;
  }
  private _changeSlideTo(slideIndex= 0): void {
      if(!this._changeSlideBlocker) {
        this._changeSlideBlocker = true;
        while(slideIndex!=this.activeSlide) {
          this._changeSlide(slideIndex>this.activeSlide);
        }
        this._changeSlideBlocker = false;
        this._autoPlay();
      }
      else return;
  }
  private _setDirection(direction: string): void {
    if(!this._changeSlideBlocker) {
      this._changeSlide(direction==='next');
    }
    else return;
  }

  public ngOnInit():void {
    const data= this.carouselItems;
    let idx= 0, sectionStartIndex= 0;
    for(let blockIndex=0; blockIndex<data.length; blockIndex++){
      this.sectionsSize.push(data[blockIndex].items.length);
      this.sectionsIndexes.push({start: sectionStartIndex, end: sectionStartIndex+data[blockIndex].items.length-1});
      sectionStartIndex+= data[blockIndex].items.length;
      for(let itemIndex=0; itemIndex<data[blockIndex].items.length; itemIndex++) {
        this.slidersSet.push({
          id:idx,
          title:data[blockIndex].items[itemIndex].title,
          texts:data[blockIndex].items[itemIndex].items,
          img:data[blockIndex].items[itemIndex].phoneImgUrl
        });
        idx++;
      }
    }
    this._autoPlayDelay = 3000;
    this._autoPlay();
  }
  ngOnDestroy() {
    if (this._autoPlayInterval) {
      clearInterval(this._autoPlayInterval);
    }
  }
  
  public mouseswipe(e:MouseEvent, when:string): void {
    const coord: [number, number]= [e.pageX, e.pageY];
    const time= new Date().getTime();
    if (when=== 'start') {
      this._swipeCoord= coord;
      this._swipeTime= time;
    }
    else if (when=== 'end') {
      const direction= [coord[0] - this._swipeCoord[0], coord[1] - this._swipeCoord[1]];
      const duration= time - this._swipeTime;
      if (
        duration < 1000
        && Math.abs(direction[0]) > 30 
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) { 
        if (direction[0] < 0) {      
          this.swipeNext();
        } else {
          this.swipePrevious();
        }
      }
    }
  }
  public paginate(page:number): void {
    this._changeSlideTo(this.sectionsIndexes[this.currentSection].start + page);
  }
  public swipeNext (): void {
    this._setDirection('next');
  }
  public swipePrevious (): void {
    this._setDirection('previous');
  }
  public swipe(e: TouchEvent, when: string): void {
    const coord: [number, number]= [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time= new Date().getTime();
    if (when=== 'start') {
      this._swipeCoord= coord;
      this._swipeTime= time;
    }
    else if (when=== 'end') {
      const direction= [coord[0] - this._swipeCoord[0], coord[1] - this._swipeCoord[1]];
      const duration= time - this._swipeTime;
      if (
        duration < 1000
        && Math.abs(direction[0]) > 30 
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)
      ) { 
        if (direction[0] < 0) {      
          this.swipeNext();
        } else {
          this.swipePrevious();
        }
      }
    }
  }
}