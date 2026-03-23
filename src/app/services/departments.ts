import { Injectable } from '@angular/core';
import { Department } from '../interfaces/department';
import { HttpClient } from '@angular/common/http'; // <-- New Import
import { Observable } from 'rxjs'; // <-- New Import

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  departments: Department[] = [];

  constructor(
    private http: HttpClient // <-- Inject HttpClient
  ) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`https://hr-timesheet-test.firebaseio.com/departments.json`);
  }
}