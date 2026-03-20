import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material-module';
import { Employee } from '../../interfaces/employee'; // <-- New Import
import { AnalyticsTable } from '../analytics-table/analytics-table'; // <-- New Import

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MaterialModule, AnalyticsTable], // <-- Add child component
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.scss']
})
export class Analytics {
  // Variable to hold filtered data (will be used later)
  employees: Employee[] = [];

  // Static test data for development
  employeeData: Employee[] = [
    {
      departmentId: '1',
      friday: 6,
      id: '1',
      monday: 4,
      name: 'a',
      payRate: 70,
      saturday: 7,
      sunday: 6,
      thursday: 5,
      tuesday: 3,
      wednesday: 4
    },
    {
      departmentId: '1',
      friday: 2,
      id: '2',
      monday: 4,
      name: 'b',
      payRate: 63,
      saturday: 1,
      sunday: 2,
      thursday: 3,
      tuesday: 3,
      wednesday: 4
    },
    {
      departmentId: '2',
      friday: 9,
      id: '3',
      monday: 8,
      name: 'c',
      payRate: 76,
      saturday: 7,
      sunday: 5,
      thursday: 4,
      tuesday: 7,
      wednesday: 5
    },
    {
      departmentId: '3',
      friday: 2,
      id: '4',
      monday: 3,
      name: 'd',
      payRate: 56,
      saturday: 3,
      sunday: 2,
      thursday: 0,
      tuesday: 4,
      wednesday: 5
    }
  ];
}