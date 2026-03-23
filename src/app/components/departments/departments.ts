import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from '../../services/departments';
import { Department } from '../../interfaces/department';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material-module';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './departments.html',
  styleUrls: ['./departments.scss']
})
export class Departments implements OnInit {
  $departments!: Observable<Department[]>;

  constructor(
    private departmentsService: DepartmentsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.$departments = this.departmentsService.getDepartments();
  }

  goToDepartment(departmentId: string): void {
    this.router.navigate(['/timesheet', { id: departmentId }]);
  }
}