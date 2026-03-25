import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Employee } from '../../interfaces/employee';
import { AsyncPipe, CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { EmployeeService } from '../../services/employee';
import { Observable, of } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-analytics-table',
  imports: [
    DecimalPipe,
    CurrencyPipe,
    TitleCasePipe,
    AsyncPipe
  ],
  templateUrl: './analytics-table.html',
  styleUrl: './analytics-table.scss'
})
export class AnalyticsTable implements OnInit, OnChanges {
  weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  employees$: Observable<Employee[]> = of([]);
  @Input() departmentId!: string;
  private employeeService: EmployeeService = inject(EmployeeService);

  ngOnInit() {
    if (this.departmentId) {
      this.employees$ = this.employeeService.getEmployeeHoursByDepartment(this.departmentId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React to departmentId input changes
    if (changes['departmentId'] && this.departmentId) {
      // Fetch new data whenever the departmentId input changes
      this.employees$ = this.employeeService.getEmployeeHoursByDepartment(this.departmentId);
    }
  }

  getTotalHours(employee: Employee): number {
    return employee.monday + employee.tuesday + employee.wednesday
      + employee.thursday + employee.friday + employee.saturday + employee.sunday;
  }
}
