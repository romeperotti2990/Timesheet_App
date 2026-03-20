export interface Employee {
    id: string;
    departmentId: string | undefined;
    name: string;
    payRate: number;
    // New properties for hours tracking
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;

    // Index Signature: Required for [(ngModel)]="employee[day]" binding
    [key: string]: string | undefined | number;
}