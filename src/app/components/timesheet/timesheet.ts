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
  weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
        departmentId: this.department?.id,
        name: this.employeeNameFC.value,
        payRate: Math.floor(Math.random() * 50) + 50,
        monday: 0,    // <-- Initialized
        tuesday: 0,   // <-- Initialized
        wednesday: 0, // <-- Initialized
        thursday: 0,  // <-- Initialized
        friday: 0,    // <-- Initialized
        saturday: 0,  // <-- Initialized
        sunday: 0     // <-- Initialized
      });

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

  getTotalHours(employee: Employee): number {
    return employee.monday + employee.tuesday + employee.wednesday
      + employee.thursday + employee.friday + employee.saturday + employee.sunday;
  }

  deleteEmployee(index: number): void {
    // The splice() method removes elements from an array: 
    // it starts at the given index and removes 1 element.
    this.employees.splice(index, 1);
  }
  
}