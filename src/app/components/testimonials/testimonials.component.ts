import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestimonialCardComponent, Testimonial } from './testimonial-card/testimonial-card.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TestimonialCardComponent],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  @ViewChild('track') trackRef!: ElementRef<HTMLElement>;

  readonly visibleCount = 3;

  testimonials: Testimonial[] = [
    {
      clientName: 'Sarah K.',
      programme: 'Online Coaching',
      videoSrc: '',
      posterImage: '',
    },
    {
      clientName: 'James T.',
      programme: 'In-Person Coaching',
      videoSrc: '',
      posterImage: '',
    },
    {
      clientName: 'Priya M.',
      programme: 'Hybrid Coaching',
      videoSrc: '',
      posterImage: '',
    },
  ];

  get hasOverflow(): boolean {
    return this.testimonials.length > this.visibleCount;
  }

  scrollPrev(): void {
    const track = this.trackRef.nativeElement;
    track.scrollBy({ left: -(track.clientWidth / this.visibleCount + 24), behavior: 'smooth' });
  }

  scrollNext(): void {
    const track = this.trackRef.nativeElement;
    track.scrollBy({ left: track.clientWidth / this.visibleCount + 24, behavior: 'smooth' });
  }
}
