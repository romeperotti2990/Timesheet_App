import { Component, OnInit } from '@angular/core';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from '../../services/departments';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { MaterialModule } from '../../modules/material-module';
import { Employee } from '../../interfaces/employee';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-timesheet',
  imports: [MaterialModule, JsonPipe],
  templateUrl: './timesheet.html',
  styleUrl: './timesheet.scss'
})
export class Timesheet implements OnInit {
  
  department!: Department;
  departments!: Department[];
  employeeNameFC = new FormControl('', this.nameValidator()); // <-- New FormControl Instance
  employees: Employee[] = [];
  employeeId = 0;

  constructor(private departmentsService: DepartmentsService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.departments = this.departmentsService.departments;
    this.department = this.departments.find(
      (department) => department.id === this.route.snapshot.params['id']
    )!;
  }

  addEmployee(): void {
    if (this.employeeNameFC.value) {
      this.employeeId++;

      this.employees.push({
        id: this.employeeId.toString(),
        departmentId: this.department?.id, // Note the use of the ? operator
        name: this.employeeNameFC.value,
        payRate: Math.floor(Math.random() * 50) + 50, // Assigns a random pay rate
      });

      // Clear the input field after successful submission
      this.employeeNameFC.setValue('');
    }
  }

  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Validation logic
      let error = null;
      if (this.employees && this.employees.length) {
        this.employees.forEach(employee => {
          // Compare lowercase input value with existing employee names
          if (employee.name.toLowerCase() === control.value.toLowerCase()) {
            error = { duplicate: true }; // Found a duplicate
          }
        });
      }
      return error; // Returns {duplicate: true} on failure, or null on success
    };
  }
}