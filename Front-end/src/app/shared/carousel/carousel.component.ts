import { Component,OnInit,OnDestroy,Input} from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})

export class CarouselComponent implements OnInit, OnDestroy {

  @Input() slides: any[] = [];



  currentSlide = 0;
  autoplay = true;
  interval: any;

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  startAutoplay() {
    this.interval = setInterval(() => {
      if (this.autoplay) {
        this.next();
      }
    }, 5000);
  }

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goTo(index: number) {
    this.currentSlide = index;
  }

  onImageError(event: any) {
    const fallbacks = [
      'https://picsum.photos/id/1018/1920/1080',
      'https://picsum.photos/id/1015/1920/1080',
      'https://picsum.photos/id/1019/1920/1080'
    ];
    event.target.src = fallbacks[this.currentSlide % fallbacks.length];
  }
}
