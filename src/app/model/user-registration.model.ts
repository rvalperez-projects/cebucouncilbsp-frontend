export interface UserRegistrationInfo {
    username : string;
    password : string;
    confirmPassword : string;
    surname: string;
    givenName: string;
    middleInitial: string;
    mobileNumber: string;
    emailAddress: string;
    institutionName: string;
    category: string;
    district: string;
    area: string;
    contactNumber: string;
}

export interface ProfileInfo {
    username : string;
    password : string;
    surname: string;
    givenName: string;
    middleInitial: string;
    mobileNumber: string;
    emailAddress: string;
    institutionId: string;
    categoryCode: string;
    district: string;
    area: string;
    contactNumber: string;
}