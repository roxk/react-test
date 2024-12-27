import React, { PropsWithChildren, useMemo } from "react";
import { ProfileRepositoryCookies } from "../../data/ProfileRepositoryCookies";
import { ProfileRepository } from "../../data/ProfileRepository";

export interface ServiceLocatorContextValue {
    profileRepository: ProfileRepository;
}

export const ServiceLocatorContext = React.createContext<ServiceLocatorContextValue>(null as never);

const profileRepo = new ProfileRepositoryCookies();

export const ServiceLocatorContextProvider: React.FC<PropsWithChildren> = props => {
    const value: ServiceLocatorContextValue = useMemo(() => {
        return {
            profileRepository: profileRepo,
        }
    }, []);
    return <ServiceLocatorContext.Provider value={value}>
        {props.children}
    </ServiceLocatorContext.Provider>
}
