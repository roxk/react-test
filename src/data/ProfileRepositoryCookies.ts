import { DateTime } from "luxon";
import { NotFoundError } from "../domain/error/NotFoundError";
import { Gender, Profile } from "../domain/User";
import { ListProfileResult, ProfileCreateRequest, ProfileRepository } from "./ProfileRepository";
import { dobFromNumeric } from "../presentation/display/ProfileDisplay";

const MaxProfileCount = 16;

const profileTemplate = {
    firstName: "Jacky",
    lastName: "Chen",
    dob: DateTime.local(1990, 12, 31),
    gender: Gender.Male,
    user: {
        email: "jackychan@bene.com.hk",
        phoneNumber: "88880000",
    }
};

const profiles: Profile[] = [];
for (let i = 0; i < MaxProfileCount; ++i) {
    profiles.push({
        ...profileTemplate,
        id: `profile_${i}`,
        gender: i % 2 == 0 ? Gender.Male : Gender.Female,
        user: {
            ...profileTemplate.user,
            email: `jackychan_${i}@bene.com.hk`,
        }
    })
}

export class ProfileRepositoryCookies implements ProfileRepository {
    ListProfiles(offset: number, limit: number, gender?: Gender): Promise<ListProfileResult> {
        // TODO: Implement offset limit...
        let result = profiles;
        if (gender != null) {
            result = result.filter(p => p.gender == gender);
        }
        result = result.slice(offset, offset + limit);
        return Promise.resolve({ profiles: result, totalCount: profiles.length });
    }
    GetProfile(id: string): Promise<Profile> {
        const result = profiles.find(p => p.id == id);
        if (result == null) {
            throw new NotFoundError();
        }
        return Promise.resolve(result);
    }
    CreateProfile(profile: ProfileCreateRequest): Promise<Profile> {
        const created: Profile = {
            ...profile,
            id: `profile_${DateTime.now().toFormat("yyyy/MM/dd")}`,
            dob: dobFromNumeric(profile.dob),
            gender: profile.gender == "M" ? Gender.Male : Gender.Female,
            user: {
                email: profile.email ?? "",
                phoneNumber: profile.phoneNumber ?? "",
            }
        };
        profiles.push(created);
        return Promise.resolve(created);
    }
    UpdateProfile(profile: Profile): Promise<Profile> {
        const updated = {
            ...profile
        };
        const index = profiles.findIndex(p => p.user.email == profile.user.email);
        if (index == -1) {
            throw new NotFoundError();
        }
        profiles[index] = updated;
        return Promise.resolve(updated);
    }
    DeleteProfile(id: string): Promise<void> {
        const index = profiles.findIndex(p => p.id == id);
        profiles.splice(index, 1);
        return Promise.resolve();
    }
}