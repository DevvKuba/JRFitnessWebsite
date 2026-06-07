import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { MethodologyComponent } from './components/methodology/methodology.component';
import { OfferingsComponent } from './components/offerings/offerings.component';
import { TransformationsComponent } from './components/transformations/transformations.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent, MethodologyComponent, OfferingsComponent, TransformationsComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(scroller: ViewportScroller) {
    scroller.setOffset([0, 80]);
  }
}
