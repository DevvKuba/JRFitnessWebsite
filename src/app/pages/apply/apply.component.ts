import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss',
})
export class ApplyComponent implements OnInit {
  private readonly SCRIPT_URL = '/.netlify/functions/submit-application';

  submitted = false;
  submitting = false;
  hasError = false;

  form = new FormGroup({
    coachingType: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    goal: new FormControl('', Validators.required),
    fitnessLevel: new FormControl('', Validators.required),
    injuries: new FormControl(''),
    referral: new FormControl('', Validators.required),
    equipment: new FormControl(''),
    preferredDays: new FormControl(''),
    trainingLocation: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.form.get('coachingType')!.valueChanges.subscribe(type => {
      this.updateConditionalValidators(type ?? '');
    });

    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.form.patchValue({ coachingType: params['type'] });
      }
    });
  }

  get coachingType() {
    return this.form.get('coachingType')!.value;
  }

  get showEquipment() {
    return this.coachingType === 'online' || this.coachingType === 'hybrid';
  }

  get showLocationDays() {
    return this.coachingType === 'in-person' || this.coachingType === 'hybrid';
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field)!;
    return control.invalid && control.touched;
  }

  private updateConditionalValidators(type: string) {
    const equipment = this.form.get('equipment')!;
    const preferredDays = this.form.get('preferredDays')!;
    const trainingLocation = this.form.get('trainingLocation')!;

    equipment.clearValidators();
    preferredDays.clearValidators();
    trainingLocation.clearValidators();
    equipment.setValue('');
    preferredDays.setValue('');
    trainingLocation.setValue('');

    if (type === 'online' || type === 'hybrid') {
      equipment.setValidators(Validators.required);
    }

    if (type === 'in-person' || type === 'hybrid') {
      preferredDays.setValidators(Validators.required);
      trainingLocation.setValidators(Validators.required);
    }

    equipment.updateValueAndValidity();
    preferredDays.updateValueAndValidity();
    trainingLocation.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.hasError = false;

    this.http.post(this.SCRIPT_URL, this.form.value).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
      },
      error: () => {
        this.hasError = true;
        this.submitting = false;
      },
    });
  }
}
