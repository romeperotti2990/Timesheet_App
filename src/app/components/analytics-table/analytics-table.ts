import { Component, Input, OnInit } from '@angular/core'; // <-- Import Input and OnInit
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material-module';
import { Employee } from '../../interfaces/employee';

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './analytics-table.html',
  styleUrls: ['./analytics-table.scss']
})
export class AnalyticsTable implements OnInit {
  // New Input property to receive the department ID from the parent
  @Input() departmentId: string | undefined;

  // We'll define the full employee data array here to filter against
  @Input() employeeData: Employee[] = [];

  // The data array we will actually loop over in the template
  employees: Employee[] = [];

  weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  ngOnInit(): void {
    // Filter the full employeeData array based on the received departmentId
    this.employees = this.employeeData.filter(employee => employee.departmentId === this.departmentId);
  }

  // Function to calculate total hours (copied from TimesheetComponent logic)
  getTotalHours(employee: Employee): number {
    return employee.monday + employee.tuesday + employee.wednesday
      + employee.thursday + employee.friday + employee.saturday + employee.sunday;
  }
}