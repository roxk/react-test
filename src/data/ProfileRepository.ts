import { Gender, Profile } from "../domain/User";

export interface ListProfileResult {
    profiles: Profile[];
    totalCount: number;
}

export type GenderInput = "M" | "F";

export interface ProfileCreateRequest {
    firstName: string;
    lastName: string;
    gender: GenderInput;
    dob: string;
    email: string | undefined;
    phoneNumber: string | undefined;
};

export interface ProfileRepository {
    ListProfiles(offset: number, limit: number, gender?: Gender): Promise<ListProfileResult>;
    GetProfile(id: string): Promise<Profile>;
    CreateProfile(profile: ProfileCreateRequest): Promise<Profile>;
    UpdateProfile(profile: Profile): Promise<Profile>;
}
