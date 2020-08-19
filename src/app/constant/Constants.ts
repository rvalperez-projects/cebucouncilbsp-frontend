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

export abstract class EnumUtil {
    static getEnumValueByValue(enumObj: any, value: string) {
        return enumObj[Object.keys(enumObj).find(key => enumObj[key] == value)];
    }
    static getEnumTextByValue(enumObj: any, value: string) {
        return Object.keys(enumObj).find(key => enumObj[key] == value);
    }
}

export abstract class SessionConstant {
    static LOGIN_TOKEN_KEY = 'login-token';
    static USER_ID_KEY = 'user-id';
    static USER_INSTITUTION_ID_KEY = 'user-institutionId';
    static USER_ROLE_CODE_KEY = 'user-roleCode';
}