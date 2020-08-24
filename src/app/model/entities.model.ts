export class BaseModel {
    createdBy: string;
    createdDateTime: Date;
    updatedBy: string;
    updatedDateTime: Date;
}

export class InstitutionModel extends BaseModel {
    institutionId: number;
    institutionName: string;
    address: string;
    contactNumber: string;
    district: string;
    area: string;
    categoryCode: string;
    unitNumbers: Array<string>;
}

export class AreaModel extends BaseModel {
    areaCode: string;
    districtName: string;
    chairmanName: string;
    chairmanContactNo: string;
    commissionerName: string;
    commissionerContactNo: string;
    remarks: string;
}

export class UserModel extends BaseModel {
    userId: number;
    surname: string;
    givenName: string;
    middleInitial: string;
    emailAddress: string;
    mobileNumber: string;
    institutionId: number;
}

export class UnitNumberModel extends BaseModel {
    unitNumber: string;
    institutionId: number;
    sectionCode: string;
    lastUsedYear: number;
}