import { Component, Input } from '@angular/core';

export interface Testimonial {
  clientName: string;
  programme: string;
  videoSrc: string;
  posterImage: string;
}

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.scss',
})
export class TestimonialCardComponent {
  @Input({ required: true }) testimonial!: Testimonial;
}
