import { Component, ElementRef, ViewChild } from '@angular/core';
import { TransformationCardComponent, Transformation } from './transformation-card/transformation-card.component';

@Component({
  selector: 'app-transformations',
  standalone: true,
  imports: [TransformationCardComponent],
  templateUrl: './transformations.component.html',
  styleUrl: './transformations.component.scss',
})
export class TransformationsComponent {
  @ViewChild('track') trackRef!: ElementRef<HTMLElement>;

  readonly visibleCount = 3;

  transformations: Transformation[] = [
    {
      duration: '16 Weeks',
      beforeImage: 'transformations/Nathan/Nathan_Before_Pic.jpeg',
      afterImage: 'transformations/Nathan/Nathan_After_Pic.jpeg',
      testimonial:
        "I've tried plenty of programmes before but nothing came close to this. The structure, the check-ins, and the constant support made all the difference.",
    },
    {
      duration: '16 Weeks',
      beforeImage: '',
      afterImage: '',
      testimonial:
        'What stood out was how personal it felt. Every session was built around me, not a generic plan. The results speak for themselves.',
    },
    {
      duration: '8 Weeks',
      beforeImage: '',
      afterImage: '',
      testimonial:
        'Eight weeks felt short but the progress was undeniable. Already signed up for the next block.',
    },
  ];

  get hasOverflow(): boolean {
    return this.transformations.length > this.visibleCount;
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
