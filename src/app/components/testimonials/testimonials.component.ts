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
      programme: 'In-Person Coaching', 
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
    {
      clientName: 'Alex',
      programme: 'In-Person Coaching', 
      videoSrc: 'testimonials/Alex/Importance_of_a_Specialised_Plan.mp4',
      posterImage: '',
      clips: [
        {
          label: 'Gym Motivation: Beat Your Comfort Zone',
          videoSrc: 'testimonials/Alex/Gym_Motivation_%20Beat%20Your%20Comfort%20Zone!.mp4',
          posterImage: '',
        },
        {
          label: 'Personal Trainer vs. Online Coach: Which is Best?',
          videoSrc: 'testimonials/Alex/Personal%20Trainer%20vs.%20Online%20Coach_%20Which%20is%20Best_.mp4',
          posterImage: '',
        },
        {
          label: 'Supporting Clients With Their Meals',
          videoSrc: 'testimonials/Alex/Supporting_clients_with_their_meals.mp4',
          posterImage: '',
        },
      ],
    },
    {
      clientName: 'Emanuela',
      programme: 'In-Person Coaching', 
      videoSrc: 'testimonials/Emanuela/Personal%20Trainer%20Experience_%20Like%20a%20Supportive%20Friend!.mp4',
      posterImage: '',
      clips: [
        {
          label: 'Amazing Transformation: What Changed in 2 Months?',
          videoSrc: 'testimonials/Emanuela/Amazing%20Transformation_%20What%20Changed%20in%202%20Months_.mp4',
          posterImage: '',
        },
        {
          label: 'Accountability: Boost Your Workout Motivation',
          videoSrc: 'testimonials/Emanuela/Personal%20Trainer%20Accountability_%20Boost%20Your%20Workout%20Motivation!.mp4',
          posterImage: '',
        },
        {
          label: 'My 6-Month Transformation Journey',
          videoSrc: 'testimonials/Emanuela/Personal%20Trainer_%20My%206-Month%20Fitness%20Transformation%20Journey.mp4',
          posterImage: '',
        },
      ],
    },
    {
      clientName: 'Rachael',
      programme: 'In-Person Coaching', 
      videoSrc: 'testimonials/Rachael/Gym%20Intimidation_%20Try%20PT!%20It%27s%20Easier%20Than%20You%20Think!.mp4',
      posterImage: '',
      clips: [
        {
          label: 'From Jelly Bones to Super Strength: My Fitness Glow Up!',
          videoSrc: 'testimonials/Rachael/From%20Jelly%20Bones%20to%20Super%20Strength_%20My%20Fitness%20Glow%20Up!.mp4',
          posterImage: '',
        },
        {
          label: 'Unlock Your Gains: Why Consistent Progression is KEY!',
          videoSrc: 'testimonials/Rachael/Unlock%20Your%20Gains_%20Why%20Consistent%20Progression%20is%20KEY!.mp4',
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
