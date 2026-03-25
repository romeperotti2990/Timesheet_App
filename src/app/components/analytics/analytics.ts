import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '../../modules/material-module';
import { AnalyticsTable } from '../analytics-table/analytics-table'; // <-- New Import
import { DepartmentsService } from '../../services/departments';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MaterialModule, AnalyticsTable], // <-- Add child component
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.scss']
})
export class Analytics {
  private departmentsService: DepartmentsService = inject(DepartmentsService);
  departments$: Observable<any> = this.departmentsService.getDepartments();
}