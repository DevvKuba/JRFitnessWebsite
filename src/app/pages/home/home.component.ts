import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { MethodologyComponent } from '../../components/methodology/methodology.component';
import { OfferingsComponent } from '../../components/offerings/offerings.component';
import { TransformationsComponent } from '../../components/transformations/transformations.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, MethodologyComponent, OfferingsComponent, TransformationsComponent, TestimonialsComponent, FooterComponent],
  template: `
    <app-hero />
    <app-methodology />
    <app-offerings />
    <app-transformations />
    <app-testimonials />
    <app-footer />
  `,
})
export class HomeComponent {}
