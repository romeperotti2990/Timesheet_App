export interface Employee {
    id?: string; // <-- Add the '?' to make it optional
    departmentId?: string; // must be defined when saving
    name: string;
    payRate: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
    [key: string]: string | number | undefined;
}