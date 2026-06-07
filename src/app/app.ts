import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { MethodologyComponent } from './components/methodology/methodology.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, HeroComponent, MethodologyComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
