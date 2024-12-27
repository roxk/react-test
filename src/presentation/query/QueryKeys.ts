import { Gender } from "../../domain/User";

export const QueryKeys = {
    profiles: (offset: number, limit: number, gender?: Gender) => ["profiles", offset, limit, gender],
    profile: (id: string) => ["profile", id]
};