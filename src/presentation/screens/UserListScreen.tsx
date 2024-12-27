import { useCallback, useMemo, useState } from "react";
import { Gender } from "../../domain/User";
import { useProfilesQuery } from "../query/ProfileQuery";
import { ProfileRowItem } from "../components/ProfileRowItem";
import { genderDisplay } from "../display/ProfileDisplay";
import { Locale } from "../intl";
import { useIntl } from "react-intl";
import { NavLink, useSearchParams } from "react-router";

function genderPickerDisplay(gender: Gender | undefined, locale: Locale): string {
    if (gender == null) {
        return "Gender";
    }
    return genderDisplay(gender, locale);
}

const defaultPage = 1;
const defaultRowPerPage = 10;
const navigateButtonStyle = "w-4 h-4";

export const UserListScreen: React.FC = () => {
    const [searchParams,] = useSearchParams();
    const queryPage = useMemo(() => {
        const pageStr = searchParams.get("page");
        if (pageStr == null) {
            return undefined;
        }
        const page = parseInt(pageStr, 10);
        if (isNaN(page)) {
            return undefined;
        }
        return page;
    }, [searchParams]);
    const page = queryPage ?? defaultPage;
    const locale = useIntl().locale;
    const [gender, setGender] = useState<Gender>();
    const [rowPerPage, setRowPerPage] = useState<number>(defaultRowPerPage);
    const { data: profileResult } = useProfilesQuery((page - 1) * rowPerPage, rowPerPage, gender);
    const profiles = profileResult?.profiles;
    const totalPageCount = useMemo(() => {
        return profileResult == null ? 1 : profileResult.totalCount == 0 ? 1 : Math.ceil(profileResult.totalCount / rowPerPage);
    }, [rowPerPage, profileResult]);
    const onClickGender = useCallback(() => {
        // TODO: Add dropdown/modal
        if (gender == null) {
            setGender(Gender.Male);
        } else if (gender == Gender.Male) {
            setGender(Gender.Female);
        } else {
            setGender(undefined);
        }
    }, [gender]);
    const onDeleteProfile = useCallback(() => {

    }, []);
    const onClickRowPerPage = useCallback(() => {
        if (rowPerPage == 10) {
            setRowPerPage(5);
        } else {
            setRowPerPage(10);
        }
    }, [rowPerPage]);
    const onClickResetFilter = useCallback(() => {
        setGender(undefined);
    }, []);
    // TODO: Loading state
    if (profiles == null) {
        // TODO: Proper empty state
        return <>No profiles</>;
    }
    const prevPage = page - 1;
    const hasPrevPage = prevPage >= 1;
    const nextPage = page + 1;
    const hasNextPage = nextPage <= totalPageCount;
    return <div className="bg-main-bg h-full w-full pt-10 py-4 px-6">
        <header className="flex items-center">
            <button onClick={onClickGender} className="bg-white border-dropdown-border border-[1px] h-8 w-[168px] rounded px-3 mr-6 text-sm text-dropdown-text items-center flex">
                <span>{genderPickerDisplay(gender, locale)}</span>
                <div className="flex-1"></div>
                {/* TODO: Export asset */}
                <span className="text-disabled">v</span>
            </button>
            <button onClick={onClickResetFilter} className="text-header-text underline text-xs">Reset filter</button>
            <div className="flex-1"></div>
            <div className="font-bold text-[22px] text-header-text w-28 text-right">Total {profileResult?.totalCount}</div>
            <NavLink to="/user/new" className="bg-primary h-8 w-[147px] rounded-lg ml-2 px-3 flex items-center text-xs font-bold text-header-text text-center justify-center"><span>Create User Account</span></NavLink>
        </header>
        <table className="mt-2 w-full">
            <thead>
                <tr className="h-12 text-xs bg-table-header text-header-text text-left">
                    <th className="pl-4 pr-5 rounded-l-lg">No.</th>
                    <th>User Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th className="rounded-r-lg">Action</th>
                </tr>
                <tr className="h-2" />
            </thead>
            <tbody>
                {profiles?.map((profile, index) => {
                    return <ProfileRowItem
                        key={`profile_${profile.user.email}`}
                        profile={profile}
                        index={index}
                        onDelete={onDeleteProfile}
                    />
                })}
            </tbody>
        </table>
        {/* TODO: Confirm whether 19px is accident (should be 20?) */}
        <footer className="flex items-center justify-end text-xs font-medium h-[19px] mt-4">
            <div className="">Rows per page:</div>
            {/* TODO: Export chevron asset */}
            <button className="ml-[10px]" onClick={onClickRowPerPage}>
                <div className="flex items-center">
                    {rowPerPage}<span className="pl-[6px] text-disabled">v</span>
                </div>
            </button>
            <div className="ml-[42px] mr-[10px]">{page} of {totalPageCount}</div>
            {/* TODO: Export left/right chevron asset */}
            {hasPrevPage ? <NavLink to={`/user?page=${page - 1}`} className={`${navigateButtonStyle} mr-6`}>&lt;</NavLink> : <div className={`${navigateButtonStyle} text-disabled mr-6`}>&lt;</div>}
            {hasNextPage ? <NavLink to={`/user?page=${page + 1}`} className={navigateButtonStyle}>&gt;</NavLink> : <div className={`${navigateButtonStyle} text-disabled`}>&gt;</div>}
        </footer >
    </div >;
}
