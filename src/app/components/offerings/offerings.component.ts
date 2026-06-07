import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offerings',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './offerings.component.html',
  styleUrl: './offerings.component.scss',
})
export class OfferingsComponent {}
