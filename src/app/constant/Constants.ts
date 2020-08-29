export class ProfileLabels {

    public static categories: InstitutionCategoryInterface[] = [
        {code: '00', text: 'Preschool'},
        {code: '01', text: 'Primary'},
        {code: '02', text: 'Secondary'},
        {code: '03', text: 'Senior High'},
        {code: '04', text: 'College'},
        {code: '05', text: 'Community'},
    ];

    public static areaDistricts: AreaDistrictsInterface[] = [];
}

interface InstitutionCategoryInterface {
    code: string,
    text: string
}

export interface AreaDistrictsInterface {
    area: string,
    district: string
}

export abstract class SessionConstant {
    static LOGIN_TOKEN_KEY = 'login-token';
    static USER_ID_KEY = 'user-id';
    static USER_INSTITUTION_ID_KEY = 'user-institutionId';
    static USER_ROLE_CODE_KEY = 'user-roleCode';
    static USER_GIVEN_NAME = 'user-givenName';
}