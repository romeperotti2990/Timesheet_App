// Don't forget these imports at the top!
import { Component, inject, OnInit, WritableSignal, signal } from '@angular/core';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from '../../services/departments';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../modules/material-module';
import { Employee } from '../../interfaces/employee';
import { AsyncPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { Observable, map, switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-timesheet',
  imports: [MaterialModule, JsonPipe, TitleCasePipe, AsyncPipe],
  templateUrl: './timesheet.html',
  styleUrl: './timesheet.scss'
})
export class Timesheet implements OnInit {
  // This will hold the observable stream for ALL departments
  $departments: Observable<Department[]> | undefined;
  // This will hold the observable stream for JUST THE CURRENT department
  $department: Observable<Department | undefined> | undefined;
  employees: WritableSignal<Employee[]> = signal<Employee[]>([]);
  employeeNameFC = new FormControl('', this.nameValidator()); // <-- Validator applied
  weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']; // <-- New

  private employeeService: EmployeeService = inject(EmployeeService);
  private departmentsService: DepartmentsService = inject(DepartmentsService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute); // Used to read URL parameters

  // Read departmentId once from the route
  private departmentId: string = this.route.snapshot.params['id'] as string;

  ngOnInit(): void {
    // Get departments stream for template usage
    this.$departments = this.departmentsService.getDepartments();
    const departmentId = this.departmentId;

    // Derive the single department observable for the heading
    this.$department = this.$departments.pipe(
      map(departments => departments.find(dept => dept.id === departmentId))
    );

    // Subscribe to departments first, then switch to employee hours for this department
    this.departmentsService.getDepartments().pipe(
      tap(() => {
        // department is already derived above; no-op here besides ensuring sequence
      }),
      switchMap(() => this.employeeService.getEmployeeHoursByDepartment(departmentId)),
      tap((employees: Employee[]) => {
        this.employees.set(employees || []);
      })
    ).subscribe();
  }
  addEmployee(): void {
    const rawName = (this.employeeNameFC.value || '').toString().trim();
    if (!rawName) {
      return;
    }
    const departmentIdFromRoute = this.route.snapshot.params['id'] as string;

    const updated = [
      ...this.employees(),
      {
        departmentId: departmentIdFromRoute,
        name: rawName,
        payRate: Math.floor(Math.random() * 50) + 50,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
      }
    ];

    this.employees.set(updated);

    this.employeeNameFC.setValue('');
    this.employeeNameFC.markAsPristine();
    this.employeeNameFC.markAsUntouched();
  }
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = (control?.value || '').toString().trim().toLowerCase();
      if (!value) {
        return null;
      }
      const list = this.employees();
      if (Array.isArray(list) && list.length) {
        for (const employee of list) {
          if ((employee.name || '').toString().trim().toLowerCase() === value) {
            return { duplicate: true };
          }
        }
      }
      return null;
    };
  }
  getTotalHours(employee: Employee): number {
    return employee.monday + employee.tuesday + employee.wednesday
      + employee.thursday + employee.friday + employee.saturday + employee.sunday;
  }
  
  async deleteEmployee(index: number): Promise<void> {
    const list = this.employees();
    if (!Array.isArray(list) || index < 0 || index >= list.length) {
      return;
    }

    const employee = list[index];

    // If the employee exists in Firestore, delete it there first
    if (employee && employee.id) {
      await this.employeeService.deleteEmployeeHours(employee);
    }

    // Remove from local array and update the signal to trigger change detection
    const updated = list.slice();
    updated.splice(index, 1);
    this.employees.set(updated);
    this.employeeNameFC.updateValueAndValidity({ emitEvent: false });
  }


  async submit(): Promise<void> {
    const list = this.employees();
    if (!list || list.length === 0) {
      return; // nothing to save
    }

    try {
      const ops = list.map((employee: Employee) => {
        if (employee.id) {
          return this.employeeService.updateEmployeeHours(employee);
        }
        return this.employeeService.saveEmployeeHours(employee);
      });

      await Promise.all(ops);
      await this.router.navigate(['/departments']);
    } catch (err) {
      console.error('Error saving/updating employee hours', err);
      alert('Failed to submit employee hours. Please try again.');
    }
  }
}