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

  // Files live in `public/`, which is served from the site root, so a path like
  // 'testimonials/Nathan/...mp4' maps to public/testimonials/Nathan/...mp4. One
  // folder per client keeps the highlight and its clips grouped together.
  //
  // Per card: `videoSrc` is the featured "highlight" cut that plays by default;
  // `clips` are the other cuts from the same testimonial, shown in the
  // collapsible "more clips" panel. Posters are left empty on purpose — the
  // player shows each video's first frame as the still.
  testimonials: Testimonial[] = [
    {
      clientName: 'Nathan',
      programme: 'Online Coaching', // TODO: set Nathan's actual programme
      videoSrc: 'testimonials/Nathan/PT%20Removes%20Workout%20Stress.mp4',
      posterImage: '',
      clips: [
        {
          label: 'Motivation to Turn up',
          videoSrc: 'testimonials/Nathan/Motivation%20to%20Turn%20up.mp4',
          posterImage: '',
        },
        {
          label: 'Why Hire a Trainer',
          videoSrc: 'testimonials/Nathan/Why%20Hire%20a%20Trainer.mp4',
          posterImage: '',
        },
      ],
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
