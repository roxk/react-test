import { DateTime, DateTimeMaybeValid } from "luxon";
import { Gender, Profile } from "../../domain/User";
import { Locale } from "../intl";

export function fullName(profile: Profile): string {
    return `${profile.firstName} ${profile.lastName}`;
}

export function dobNumeric(profile: Profile): string {
    return profile.dob.toFormat("yyyy/MM/dd");
}

export function dobFromNumeric(input: string): DateTimeMaybeValid {
    return DateTime.fromFormat(input, "yyyy/MM/dd");
}

export function genderDisplay(gender: Gender, _locale: Locale): string {
    switch (gender) {
        case Gender.Female:
            return "Female";
        case Gender.Male:
            return "Male";
        default:
            return "unknown gender";
    }
}
