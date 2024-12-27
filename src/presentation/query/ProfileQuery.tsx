import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { QueryKeys } from "./QueryKeys";
import { useContext } from "react";
import { Gender } from "../../domain/User";
import { ServiceLocatorContext } from "../context/ServiceLocatorContext";
import { ListProfileResult } from "../../data/ProfileRepository";

export function useProfileQuery(offset: number, limit: number, gender?: Gender): UseQueryResult<ListProfileResult> {
    const profileRepo = useContext(ServiceLocatorContext)?.profileRepository;
    return useQuery(QueryKeys.profiles(offset, limit, gender), async () => {
        const profiles = await profileRepo.ListProfiles(offset, limit, gender);
        return profiles;
    });
}