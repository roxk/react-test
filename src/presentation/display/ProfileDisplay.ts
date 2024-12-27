import { Gender, Profile } from "../../domain/User";
import { Locale } from "../intl";

export function fullName(profile: Profile): string {
    return `${profile.firstName} ${profile.lastName}`;
}

export function dobNumeric(profile: Profile): string {
    return profile.dob.toFormat("yyyy/MM/dd");
}

export function genderDisplay(gender: Gender, locale: Locale): string {
    switch (gender) {
        case Gender.Female:
            return "Female";
        case Gender.Male:
            return "Male";
        default:
            return "unknown gender";
    }
}
