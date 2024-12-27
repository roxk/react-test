import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router";
import { Gender, Profile } from "../../domain/User";
import { useProfileQuery } from "../query/ProfileQuery";
import { FormInput } from "../components/FormInput";
import { dobNumeric, dobFromNumeric } from "../display/ProfileDisplay";
import { GenderInput, ProfileCreateRequest } from "../../data/ProfileRepository";

interface DetailParam {
    profileId: string;
}

type DetailParamType = keyof DetailParam;

interface UserDetailState {
    firstName: string;
    lastName: string;
    nameError: string | undefined;
    gender: GenderInput;
    dob: string;
    dobError: string | undefined;
    email: string;
    phoneNumber: string;
    emailOrPhoneError: string | undefined;
    password: string;
    confirmPassword: string;
    passwordError: string | undefined;
    onChangeFirstName: (value: string) => void;
    onChangeLastName: (value: string) => void;
    onChangeGender: (value: GenderInput) => void;
    onChangeDob: (value: string) => void;
    onChangeEmail: (value: string) => void;
    onChangePhoneNumber: (value: string) => void;
    onChangePassword: (value: string) => void;
    onChangeConfirmPassword: (value: string) => void;
    validate: () => boolean;
}

function toGenderInput(gender?: Gender): GenderInput {
    return gender == null ? "M" : gender == Gender.Male ? "M" : "F";
}

function useUserDetailState(profile?: Profile): UserDetailState {
    const [firstName, setFirstName] = useState<string>(profile?.firstName ?? "");
    const [lastName, setLastName] = useState<string>(profile?.lastName ?? "");
    const [gender, setGender] = useState<GenderInput>(toGenderInput(profile?.gender));
    const [dob, setDob] = useState<string>(profile == null ? "" : dobNumeric(profile));
    const [email, setEmail] = useState<string>(profile?.user?.email ?? "");
    const [phoneNumber, setPhoneNumber] = useState<string>(profile?.user?.phoneNumber ?? "");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [nameError, setNameError] = useState<string | undefined>();
    const [dobError, setDobError] = useState<string | undefined>();
    const [emailOrPhoneError, setEmailOrPhoneError] = useState<string | undefined>();
    const [passwordError, setPasswordError] = useState<string | undefined>();
    const validate = useCallback(() => {
        setNameError(undefined);
        setDobError(undefined);
        setEmailOrPhoneError(undefined);
        setPasswordError(undefined);
        let result = true;
        if (firstName == "" || lastName == "") {
            setNameError("Name must not be empty");
            result = false;
        }
        const dobDateTime = dobFromNumeric(dob);
        if (!dobDateTime.isValid) {
            setDobError("Invalid date");
            result = false;
        } else {
            const diff = dobDateTime.diffNow("day");
            if (diff.days >= -1) {
                setDobError("Cannot pick today or dates after today");
                result = false;
            }
        }
        if (email == "" && phoneNumber == "") {
            setEmailOrPhoneError("Must enter either email or phone");
            result = false;
        } else if (phoneNumber != "") {
            if (!phoneNumber.startsWith("+852")) {
                setEmailOrPhoneError("Phone must starts with +852");
                result = false;
            } else if (phoneNumber.length != 12) {
                setEmailOrPhoneError("Invalid number of phone number digits");
                result = false;
            }
        }
        if (password == "") {
            setPasswordError("Password must not be empty");
            result = false;
        } else if (password != confirmPassword) {
            setPasswordError("Password doesn't match confirm password");
            result = false;
        }
        return result;
    }, [confirmPassword, dob, email, firstName, lastName, password, phoneNumber]);
    const state: UserDetailState = useMemo(() => {
        return {
            firstName,
            lastName,
            nameError,
            gender,
            dob,
            dobError,
            email,
            phoneNumber,
            emailOrPhoneError,
            password,
            confirmPassword,
            passwordError,
            onChangeFirstName: setFirstName,
            onChangeLastName: setLastName,
            onChangeGender: setGender,
            onChangeDob: setDob,
            onChangeEmail: setEmail,
            onChangePhoneNumber: setPhoneNumber,
            onChangePassword: setPassword,
            onChangeConfirmPassword: setConfirmPassword,
            validate,
        }
    }, [confirmPassword, dob, dobError, email, emailOrPhoneError, firstName, gender, lastName, nameError, password, passwordError, phoneNumber, validate]);
    return state;
}

// TODO: Use react form
export const UserDetailScreen: React.FC = () => {
    const params = useParams<DetailParamType>();
    const isAdd = params.profileId == "new";
    const { data: profile, isLoading } = useProfileQuery(params.profileId ?? "", !isAdd);
    return isAdd
        ? <AddUserScreen />
        : isLoading
            ? <>Loading state</>
            : profile == null
                ? <>Error state</>
                : <EditUserScreen profile={profile} />;
}

const AddUserScreen: React.FC = () => {
    const state = useUserDetailState(undefined);
    return <DetailImpl state={state} />
}

interface EditUserProps {
    profile: Profile;
}

const EditUserScreen: React.FC<EditUserProps> = (props) => {
    const { profile } = props;
    const state = useUserDetailState(profile);
    return <DetailImpl state={state} />
}

interface DetailImplProps {
    state: UserDetailState;
}

const sectionTitleStyle = "text-sm text-header-text font-bold";

const DetailImpl: React.FC<DetailImplProps> = (props) => {
    const { state } = props;
    const onClickSubmit = useCallback(() => {
        if (state.validate()) {
            const profile: ProfileCreateRequest = {
                firstName: state.firstName,
                lastName: state.lastName,
                dob: state.dob,
                gender: state.gender,
                email: state.email,
                phoneNumber: state.phoneNumber
            }
            const profileJson = JSON.stringify(profile);
            alert(`The profile json to post is: ${profileJson}`);
            // TODO: Pass to CreateProfileMutation if add, UpdateProfileMutation if update
            // CreateProfileMutation should invalidate list queries
            // UpdateProfileMutation should invalidate the profile with the same id
        }
    }, [state]);
    return <div className="p-5">
        <header className="h-7">
            <div className="h-6 text-base text-header-text font-semibold">User Data</div>
            <div className="border-b-2 h-0.5 border-primary"></div>
        </header>
        <div className={`${sectionTitleStyle} mt-6`}>Profile Information</div>
        <div className="mt-5 flex">
            <FormInput className="mr-5" title="FirstName*" value={state.firstName} onChangeValue={state.onChangeFirstName} />
            <FormInput title="Last Name*" value={state.lastName} onChangeValue={state.onChangeLastName} />
        </div>
        {state.nameError != null ? <div className="text-xs text-red-600">{state.nameError}</div> : null}
        <div className="mt-5">
            {/* <FormInput title="Gender" value="" /> */}
            <FormInput className="ml-5" title="Date of Birth" value={state.dob} onChangeValue={state.onChangeDob} />
        </div>
        {state.dobError != null ? <div className="text-xs text-red-600">{state.dobError}</div> : null}
        <div className={`${sectionTitleStyle} mt-5`}>Login Information</div>
        <div className="mt-1 text-xs text-header-text font-medium">Choose one login method to input - either email address or phone number</div>
        <div className="mt-5 flex">
            <FormInput className="mr-5" title="Email Address*" value={state.email} onChangeValue={state.onChangeEmail} />
            <FormInput title="Phone Number" value={state.phoneNumber} onChangeValue={state.onChangePhoneNumber} />
        </div>
        {state.emailOrPhoneError != null ? <div className="text-xs text-red-600">{state.emailOrPhoneError}</div> : null}
        <div className="mt-5 flex">
            <FormInput className="mr-5" title="Password*" value={state.password} type="password" onChangeValue={state.onChangePassword} />
            <FormInput title="Confirm Password*" value={state.confirmPassword} type="password" onChangeValue={state.onChangeConfirmPassword} />
        </div>
        {state.passwordError != null ? <div className="text-xs text-red-600">{state.passwordError}</div> : null}
        <button onClick={onClickSubmit} className="bg-primary rounded-lg min-w-12 p-[10px] h-11 flex items-center justify-center mt-6"><span className="text-xl font-semibold">Submit</span></button>
    </div>;
}

