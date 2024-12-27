import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QueryKeys } from "./QueryKeys";
import { useContext } from "react";
import { Gender, Profile } from "../../domain/User";
import { ServiceLocatorContext } from "../context/ServiceLocatorContext";
import { ListProfileResult } from "../../data/ProfileRepository";

export function useProfilesQuery(offset: number, limit: number, gender?: Gender): UseQueryResult<ListProfileResult> {
    const profileRepo = useContext(ServiceLocatorContext)?.profileRepository;
    return useQuery(QueryKeys.profiles(offset, limit, gender), async () => {
        const profiles = await profileRepo.ListProfiles(offset, limit, gender);
        return profiles;
    });
}

export function useProfileQuery(id: string, isEnabled: boolean): UseQueryResult<Profile> {
    const profileRepo = useContext(ServiceLocatorContext).profileRepository;
    return useQuery(QueryKeys.profile(id), async () => {
        const profile = await profileRepo.GetProfile(id);
        return profile;
    }, {
        enabled: isEnabled
    });
}