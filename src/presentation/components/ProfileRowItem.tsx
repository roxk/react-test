import { useIntl } from "react-intl";
import { Profile } from "../../domain/User";
import { dobNumeric, fullName, genderDisplay } from "../display/ProfileDisplay";
import { NavLink } from "react-router";
import { useCallback, useMemo } from "react";

export interface ProfileRowItemProps {
    profile: Profile;
    index: number;
    onDelete: (profile: Profile) => void;
}

export const ProfileRowItem: React.FC<ProfileRowItemProps> = (props) => {
    const locale = useIntl().locale;
    const { profile, index, onDelete } = props;
    const onClickDelete = useCallback(() => {
        onDelete(profile);
    }, [onDelete, profile]);
    const valueStyle = useMemo(() => {
        return "font-medium text-sm pr-5";
    }, []);
    return <>
        {index == 0 ? null : <tr className="h-1" />}
        <tr className="bg-table-row h-16">
            <td className={`${valueStyle} pl-4 pr-5 rounded-l-lg`}>{index + 1}</td>
            <td className={valueStyle}>{fullName(profile)}</td>
            <td className={valueStyle}>{profile.user.email}</td>
            <td className={valueStyle}>{profile.user.phoneNumber}</td>
            <td className={valueStyle}>{genderDisplay(profile.gender, locale)}</td>
            <td className={valueStyle}>{dobNumeric(profile)}</td>
            <td className="rounded-r-lg">
                <div className="flex items-center">
                    <NavLink to={`user/${profile.user.email}`} className="text-header-text rounded-lg border border-header-text h-8 w-14 text-xs font-medium flex items-center justify-center mr-1"><span>Edit</span></NavLink>
                    <button onClick={onClickDelete} className="text-alert rounded-lg border border-alert h-8 w-14 text-xs font-medium flex items-center justify-center mr-1"><span>Delete</span></button>
                </div>
            </td>
        </tr></>
};