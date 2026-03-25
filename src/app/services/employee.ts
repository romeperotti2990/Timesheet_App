import { inject, Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Employee } from '../interfaces/employee';
import { Observable, of, defer, from, map } from 'rxjs';
// IMPORTANT: Add 'collectionData' to your AngularFire imports
import { Firestore, deleteDoc, collection, addDoc, query, where, collectionData, doc, setDoc } from '@angular/fire/firestore';

/**
 * Service for handling all Employee data interactions with Cloud Firestore.
 */
@Injectable({
  providedIn: 'root', // Makes the service available everywhere
})
export class EmployeeService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  // ... saveEmployeeHours function remains the same ...
  async saveEmployeeHours(employee: Employee): Promise<void> {
    // 1. Get a reference to the 'employee-hours' collection.
    const collectionRef = collection(this.firestore, 'employee-hours');

    // 2. Add the employee data as a new document.
    // addDoc automatically generates a unique ID for the new document.
    await addDoc(collectionRef, employee);
  }



  /**
  * Queries Firestore for employees belonging to a specific department.
  * Returns a real-time Observable that streams updates via collectionData.
  */
  getEmployeeHoursByDepartment(departmentId: string): Observable<Employee[]> {
    if (!departmentId) {
      return of([] as Employee[]);
    }
    const colRef = collection(this.firestore, 'employee-hours');
    const q = query(colRef, where('departmentId', '==', departmentId));
    return collectionData(q, { idField: 'id' }) as Observable<Employee[]>;
  }

  /**
   * Updates an existing employee document in Firestore.
   * NOTE: setDoc() will overwrite the entire document if not told otherwise.
   * @param employee The Employee object, which MUST contain the Firestore 'id'.
   * @returns A Promise that resolves when the update is complete.
   */
  async updateEmployeeHours(employee: Employee): Promise<void> {
    // 1. Get a reference to the specific document.
    // doc() takes the collection reference and the document's unique ID (employee.id).
    // The '!' tells TypeScript that 'employee.id' is guaranteed to exist here.
    const collectionRef = collection(this.firestore, 'employee-hours');
    const employeeDocRef = doc(collectionRef, employee.id!);

    // 2. Use setDoc() to replace the document with the new employee object.
    // Since we are updating, 'id' is necessary. We spread the employee object 
    // to pass the clean data fields (excluding the ID itself from the payload is often cleaner, 
    // but here we pass the whole object for simplicity and consistency with the previous structure).
    // NOTE: setDoc() is an overwrite. If you wanted to only update a few fields, you would use updateDoc().
    return await setDoc(employeeDocRef, employee);
  }

  /**
 * Deletes an existing Employee record from Firestore.
 */
  async deleteEmployeeHours(employee: Employee): Promise<void> {
    // 1. Get a reference to the specific document using doc().
    // We use the non-null assertion operator (!) on employee.id
    // because we only call this method when employee.id is guaranteed to exist.
    const docRef = doc(this.firestore, 'employee-hours', employee.id!);

    // 2. Delete the document using the deleteDoc() function.
    return deleteDoc(docRef);
  }
}
