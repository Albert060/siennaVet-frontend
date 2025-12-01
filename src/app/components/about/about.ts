import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % 4;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + 4) % 4;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
