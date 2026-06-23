import {
  Component,
  ElementRef,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';

export interface TestimonialClip {
  label: string;
  videoSrc: string;
  posterImage: string;
}

export interface Testimonial {
  clientName: string;
  programme: string;
  /** The featured "highlight" cut that plays by default. */
  videoSrc: string;
  posterImage: string;
  /** Additional cuts taken from the same client's testimonial. */
  clips?: TestimonialClip[];
}

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  templateUrl: './testimonial-card.component.html',
  styleUrl: './testimonial-card.component.scss',
})
export class TestimonialCardComponent {
  testimonial = input.required<Testimonial>();

  private readonly player = viewChild<ElementRef<HTMLVideoElement>>('player');

  readonly expanded = signal(false);
  readonly activeIndex = signal(0);

  /** Highlight first, then the additional clips — index 0 is always the highlight. */
  readonly playlist = computed<TestimonialClip[]>(() => {
    const t = this.testimonial();
    return [
      { label: 'Highlight', videoSrc: t.videoSrc, posterImage: t.posterImage },
      ...(t.clips ?? []),
    ];
  });

  readonly hasClips = computed(() => (this.testimonial().clips?.length ?? 0) > 0);

  readonly activeVideo = computed(
    () => this.playlist()[this.activeIndex()] ?? this.playlist()[0],
  );

  private playOnNextRender = false;

  constructor() {
    // Reset to the highlight whenever a different testimonial is bound.
    effect(() => {
      this.testimonial();
      this.activeIndex.set(0);
      this.expanded.set(false);
    });

    // Load (and, when the user picked a clip, play) the selected video.
    effect(() => {
      this.activeIndex();
      const video = this.player()?.nativeElement;
      if (!video) {
        return;
      }
      video.load();
      if (this.playOnNextRender) {
        this.playOnNextRender = false;
        video.play().catch(() => {});
      }
    });
  }

  toggleExpanded(): void {
    this.expanded.update((open) => !open);
  }

  selectClip(index: number): void {
    if (index === this.activeIndex()) {
      return;
    }
    this.playOnNextRender = true;
    this.activeIndex.set(index);
  }
}
