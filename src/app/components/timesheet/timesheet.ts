import { Component, OnInit } from '@angular/core';
import { DepartmentsService } from '../../services/departments';
import { Department } from '../../interfaces/department';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../modules/material-module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './timesheet.html',
  styleUrls: ['./timesheet.scss']
})
export class Timesheet implements OnInit {
  department!: Department;
  departments!: Department[];

  constructor(
    private departmentsService: DepartmentsService,
    private route: ActivatedRoute // <-- New
  ) { }

  ngOnInit(): void {
    this.departments = this.departmentsService.departments;
    this.department = this.departments.find(
      (department) => department.id === this.route.snapshot.params['id']
    )!;
  }
}
