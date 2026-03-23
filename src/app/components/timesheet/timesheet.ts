import { Component, inject, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { Department } from '../../interfaces/department';
import { DepartmentsService } from '../../services/departments';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../modules/material-module';
import { Employee } from '../../interfaces/employee';
import { AsyncPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { EmployeeService } from '../../services/employee';
import { Observable, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
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
  // Employees signal for template consumption (no BehaviorSubject, no manual subscribe)
  employees: WritableSignal<Employee[]> = signal<Employee[]>([]);
  employeeNameFC = new FormControl('', this.nameValidator()); // <-- Validator applied
  weekdays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']; // <-- New

  private employeeService: EmployeeService = inject(EmployeeService);
  private departmentsService: DepartmentsService = inject(DepartmentsService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute); // Used to read URL parameters

  // Read departmentId once from the route
  private departmentId: string = this.route.snapshot.params['id'] as string;

  // Read employees for this department from the server as a signal (no manual subscribe/effect)
  private employeesFromServer: Signal<Employee[]> = toSignal(
    this.employeeService.getEmployeeHoursByDepartment(this.departmentId),
    { initialValue: [] }
  );
  ngOnInit(): void {
    this.$departments = this.departmentsService.getDepartments();
    const departmentId = this.departmentId;

    this.$department = this.$departments.pipe(
      map(departments => departments.find(dept => dept.id === departmentId))
    );

    // Seed our writable signal from the server data once (no manual subscribe/effect)
    const fromDb = this.employeesFromServer();
    this.employees.set(Array.isArray(fromDb) ? fromDb : []);
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
  deleteEmployee(index: number): void {
    const list = this.employees();
    if (!Array.isArray(list)) {
      return;
    }
    if (index < 0 || index >= list.length) {
      return;
    }
    const updated = list.slice();
    updated.splice(index, 1);
    this.employees.set(updated);
  }


  async submit(): Promise<void> {
    const list = this.employees();
    if (!list || list.length === 0) {
      return; // nothing to save
    }

    try {
      const savePromises = list.map(emp => this.employeeService.saveEmployeeHours(emp));
      await Promise.all(savePromises);
      // Navigate back to the departments page after successful saves
      await this.router.navigate(['./departments']);
    } catch (err) {
      console.error('Error saving employee hours', err);
      // Basic user feedback; in a real app, swap for a snackbar/toast service
      alert('Failed to save employee hours. Please try again.');
    } finally {
      // updating anything here will happen after success or failure like a save
    }
  }
}