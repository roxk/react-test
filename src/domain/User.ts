import { DateTime } from "luxon";

export enum Gender {
    Male,
    Female
}

export interface Profile {
    firstName: string;
    lastName: string;
    gender: Gender;
    dob: DateTime;
    user: User;
}

export interface User {
    email: string;
    phoneNumber: string;
}
