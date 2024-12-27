import { Gender, Profile } from "../domain/User";

export interface ListProfileResult {
    profiles: Profile[];
    totalCount: number;
}

export interface ProfileRepository {
    ListProfiles(offset: number, limit: number, gender?: Gender): Promise<ListProfileResult>;
    CreateProfile(profile: Profile): Promise<Profile>;
    UpdateProfile(profile: Profile): Promise<Profile>;
}
