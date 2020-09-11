import { AreaDistrictsModel } from '../model/user-registration.model';

export class ProfileLabels {

    public static categories: Mapper[] = [
        {code: '00', text: 'Preschool'},
        {code: '01', text: 'Primary'},
        {code: '02', text: 'Secondary'},
        {code: '03', text: 'Senior High'},
        {code: '04', text: 'College'},
        {code: '05', text: 'Community'}
    ];

    public static areaDistricts: AreaDistrictsModel[] = [];
}

interface Mapper {
    code: string,
    text: string
}

export abstract class SessionConstant {
    static LOGIN_TOKEN_KEY = 'login-token';
    static USER_ID_KEY = 'user-id';
    static USER_INSTITUTION_ID_KEY = 'user-institutionId';
    static USER_ROLE_CODE_KEY = 'user-roleCode';
    static USER_GIVEN_NAME = 'user-givenName';
}

export class ScoutingSections {

    public static categories: Mapper[] = [
        {code: '00', text: 'Langkay'},
        {code: '01', text: 'Kawan'},
        {code: '02', text: 'Troop'},
        {code: '03', text: 'Outfit'},
        {code: '04', text: 'Circle'}
    ];
}