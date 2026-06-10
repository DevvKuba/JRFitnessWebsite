import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { MethodologyComponent } from '../../components/methodology/methodology.component';
import { TransformationsComponent } from '../../components/transformations/transformations.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { OfferingsComponent } from '../../components/offerings/offerings.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, MethodologyComponent, TransformationsComponent, TestimonialsComponent, OfferingsComponent, FooterComponent],
  template: `
    <app-hero />
    <app-methodology />
    <app-transformations />
    <app-testimonials />
    <app-offerings />
    <app-footer />
  `,
})
export class HomeComponent {}
