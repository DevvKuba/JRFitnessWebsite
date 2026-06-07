import { Component, Input } from '@angular/core';

export interface Transformation {
  duration: string;
  beforeImage: string;
  afterImage: string;
  testimonial: string;
}

@Component({
  selector: 'app-transformation-card',
  standalone: true,
  templateUrl: './transformation-card.component.html',
  styleUrl: './transformation-card.component.scss',
})
export class TransformationCardComponent {
  @Input({ required: true }) transformation!: Transformation;
}
