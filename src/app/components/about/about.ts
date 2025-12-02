import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About implements OnInit, OnDestroy {
  currentSlide = 0;
  private carouselInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide() {
    this.resetAutoSlide();
    this.currentSlide = (this.currentSlide + 1) % 5;
  }

  prevSlide() {
    this.resetAutoSlide();
    this.currentSlide = (this.currentSlide - 1 + 5) % 5;
  }

  goToSlide(index: number) {
    this.resetAutoSlide();
    this.currentSlide = index;
  }

  private startAutoSlide() {
    this.carouselInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % 5;
    }, 2000); // Change slide every 2 seconds
  }

  private resetAutoSlide() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    this.startAutoSlide();
  }
}
