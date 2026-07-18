import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-free-plan',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './free-plan.component.html',
  styleUrl: './free-plan.component.scss',
})
export class FreePlanComponent {
  private readonly SCRIPT_URL = '/.netlify/functions/submit-lead';

  submitted = signal(false);
  submitting = signal(false);
  hasError = signal(false);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private http: HttpClient) {}

  isInvalid(field: string): boolean {
    const control = this.form.get(field)!;
    return control.invalid && control.touched;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.hasError.set(false);

    this.http.post(this.SCRIPT_URL, this.form.value).subscribe({
      next: () => {
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.submitting.set(false);
      },
    });
  }
}
