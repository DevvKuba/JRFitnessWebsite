import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-three-day-plan',
  standalone: true,
  templateUrl: './three-day-plan.component.html',
  styleUrl: './three-day-plan.component.scss',
})
export class ThreeDayPlanComponent implements OnInit {
  private static readonly PDF_URL = '/documents/JR-Fitness-3-Day-Plan.pdf';
  private static readonly PDF_FILENAME = 'JR-Fitness-3-Day-Plan.pdf';

  autoDownloadTriggered = signal(false);

  ngOnInit(): void {
    this.triggerDownload();
    this.autoDownloadTriggered.set(true);
  }

  downloadPlan(): void {
    this.triggerDownload();
  }

  private triggerDownload(): void {
    const link = document.createElement('a');
    link.href = ThreeDayPlanComponent.PDF_URL;
    link.download = ThreeDayPlanComponent.PDF_FILENAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
