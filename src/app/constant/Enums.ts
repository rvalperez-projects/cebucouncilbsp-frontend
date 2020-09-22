export enum Roles {
    GENERAL_USER = "00",
    COUNCIL = "01",
    ADMIN = "99"
}
export enum FormStatus {
    SUBMITTED = "00",
    PAID = "01",
    PROCESSED = "02"
}
export enum SectionCode {
    LANGKAY = "00",
    KAWAN = "01",
    TROOP = "02",
    OUTFIT = "03",
    CIRCLE = "04"
}
export enum InstitutionCategory {
    PRESCHOOL = "00",
    PRIMARY = "01",
    SECONDARY = "02",
    SENIOR_HIGH = "03",
    COLLEGE = "04",
    COMMUNITY = "05"
}

export abstract class EnumUtil {
    static getEnumValueByValue(enumObj: any, value: string) {
        return enumObj[Object.keys(enumObj).find(key => enumObj[key] == value)];
    }
    static getEnumTextByValue(enumObj: any, value: string) {
        return Object.keys(enumObj).find(key => enumObj[key] == value);
    }
}