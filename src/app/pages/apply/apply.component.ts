import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface StudioSlot {
  key: string;
  label: string;
  range: string;
}

interface StudioDay {
  day: string;
  label: string;
  hours: string;
  slots: StudioSlot[];
}

function requireNonEmptySelection(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss',
})
export class ApplyComponent implements OnInit {
  private readonly SCRIPT_URL = '/.netlify/functions/submit-application';

  submitted = signal(false);
  submitting = signal(false);
  hasError = signal(false);

  // Studio hours as of August 2026 — kept as open as possible for the launch
  // month. Update this array directly when hours narrow down (e.g. from
  // September once full-time work starts).
  readonly studioAvailability: StudioDay[] = [
    {
      day: 'wednesday',
      label: 'Wednesday',
      hours: '14:00 – 22:00',
      slots: [
        { key: 'wednesday-afternoon', label: 'Afternoon', range: '14:00 – 17:00' },
        { key: 'wednesday-evening', label: 'Evening', range: '17:00 – 22:00' },
      ],
    },
    {
      day: 'friday',
      label: 'Friday',
      hours: '12:00 – 22:00',
      slots: [
        { key: 'friday-afternoon', label: 'Afternoon', range: '12:00 – 17:00' },
        { key: 'friday-evening', label: 'Evening', range: '17:00 – 22:00' },
      ],
    },
    {
      day: 'saturday',
      label: 'Saturday',
      hours: '07:00 – 20:00',
      slots: [
        { key: 'saturday-morning', label: 'Morning', range: '07:00 – 12:00' },
        { key: 'saturday-afternoon', label: 'Afternoon', range: '12:00 – 17:00' },
        { key: 'saturday-evening', label: 'Evening', range: '17:00 – 20:00' },
      ],
    },
    {
      day: 'sunday',
      label: 'Sunday',
      hours: '07:00 – 20:00',
      slots: [
        { key: 'sunday-morning', label: 'Morning', range: '07:00 – 12:00' },
        { key: 'sunday-afternoon', label: 'Afternoon', range: '12:00 – 17:00' },
        { key: 'sunday-evening', label: 'Evening', range: '17:00 – 20:00' },
      ],
    },
  ];

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
    paymentPlan: new FormControl(''),
    preferredSlots: new FormControl<string[]>([]),
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
    return this.coachingType === 'twelve-week';
  }

  get showLocationDays() {
    return this.coachingType === 'in-person';
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field)!;
    return control.invalid && control.touched;
  }

  isSlotSelected(key: string): boolean {
    return (this.form.get('preferredSlots')!.value ?? []).includes(key);
  }

  toggleSlot(key: string): void {
    const control = this.form.get('preferredSlots')!;
    const current: string[] = control.value ?? [];
    const next = current.includes(key) ? current.filter(k => k !== key) : [...current, key];
    control.setValue(next);
    control.markAsTouched();
  }

  private updateConditionalValidators(type: string) {
    const equipment = this.form.get('equipment')!;
    const paymentPlan = this.form.get('paymentPlan')!;
    const preferredSlots = this.form.get('preferredSlots')!;
    const trainingLocation = this.form.get('trainingLocation')!;

    equipment.clearValidators();
    paymentPlan.clearValidators();
    preferredSlots.clearValidators();
    trainingLocation.clearValidators();
    equipment.setValue('');
    paymentPlan.setValue('');
    preferredSlots.setValue([]);
    trainingLocation.setValue('');

    if (type === 'twelve-week') {
      equipment.setValidators(Validators.required);
      paymentPlan.setValidators(Validators.required);
    }

    if (type === 'in-person') {
      preferredSlots.setValidators(requireNonEmptySelection);
      trainingLocation.setValidators(Validators.required);
    }

    equipment.updateValueAndValidity();
    paymentPlan.updateValueAndValidity();
    preferredSlots.updateValueAndValidity();
    trainingLocation.updateValueAndValidity();
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
