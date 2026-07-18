import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { MethodologyComponent } from '../../components/methodology/methodology.component';
import { TransformationsComponent } from '../../components/transformations/transformations.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';
import { OfferingsComponent } from '../../components/offerings/offerings.component';
import { FreePlanTeaserComponent } from '../../components/free-plan-teaser/free-plan-teaser.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    MethodologyComponent,
    TransformationsComponent,
    TestimonialsComponent,
    OfferingsComponent,
    FreePlanTeaserComponent,
    FooterComponent,
  ],
  template: `
    <app-hero />
    <app-transformations />
    <app-testimonials />
    <app-methodology />
    <app-offerings />
    <app-free-plan-teaser />
    <app-footer />
  `,
})
export class HomeComponent {}
