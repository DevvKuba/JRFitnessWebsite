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
      clientName: 'Nathan',
      duration: '16 Weeks',
      beforeImage: 'transformations/Nathan/Nathan_Before_Pic.jpeg',
      afterImage: 'transformations/Nathan/Nathan_After_Pic.jpeg',
      testimonial:
        "The biggest thing for me was not having to think about any of it. Kuba tells me what to do and how to do it, so I just turn up and train — and that's what actually got me to the gym consistently."
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
