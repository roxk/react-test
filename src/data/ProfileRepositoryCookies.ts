import { DateTime } from "luxon";
import { NotFoundError } from "../domain/error/NotFoundError";
import { Gender, Profile } from "../domain/User";
import { ListProfileResult, ProfileRepository } from "./ProfileRepository";

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
    CreateProfile(profile: Profile): Promise<Profile> {
        // TODO: Validation?
        const created = {
            ...profile,
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
}