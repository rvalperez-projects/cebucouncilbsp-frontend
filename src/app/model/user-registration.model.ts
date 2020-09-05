export class ProfileInfo {
    userId : number;
    username : string;
    password : string;
    surname: string;
    givenName: string;
    middleInitial: string;
    mobileNumber: string;
    emailAddress: string;
    institutionId: number;
    institutionName: string;
    address: string;
    categoryCode: string;
    district: string;
    area: string;
    contactNumber: string;
    authorityCode: string;
}

export class AreaDistrictsModel {
    area: string;
    district: string;

    constructor(area, district) {
        this.area = area;
        this.district = district;
    }
}