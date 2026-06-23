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

  // Drop video files into `public/testimonials/` and reference them by path
  // (e.g. videoSrc: 'testimonials/sarah-highlight.mp4'). `videoSrc` is the
  // featured "highlight" cut; `clips` are the other cuts taken from the same
  // client's testimonial and appear in the collapsible panel on the card.
  testimonials: Testimonial[] = [
    {
      clientName: 'Sarah K.',
      programme: 'Online Coaching',
      videoSrc: '',
      posterImage: '',
      clips: [
        { label: 'Why she joined', videoSrc: '', posterImage: '' },
        { label: 'The turning point', videoSrc: '', posterImage: '' },
        { label: 'Where she is now', videoSrc: '', posterImage: '' },
      ],
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
