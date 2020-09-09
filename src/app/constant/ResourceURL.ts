import { environment } from '../../environments/environment';

export abstract class ResourceURL {

    static HOST = environment.apiUrl;

    static LOGIN = "/auth/login";
    static LOGOUT = "/auth/logout";
    static SIGN_UP = "/auth/sign-up";
    static AREA_DISTRICTS = "/auth/areaDistricts";
    static USER_ID = "/user/{userId}";
    static USER_SEARCH = "/user/search";
    static FORM_SUBMIT = "/form/submit";
    static FORM_DISPLAY = "/form/{formId}";
    static FORM_SEARCH = "/form/search";
    static FORM_UPDATE = "/form/update";
    static FORM_UPLOAD_PAYMENT = "/form/payment";
    static FORM_DELETE = "/form/delete/{formId}";
    static INSTITUTION_ALL = "/institution/all";
    static INSTITUTION_ID = "/institution/{institutionId}";
    static INSTITUTION_UNIT_NUMBERS = "/institution/unitNumbers/{institutionId}";
    static AREA_ALL = "/area/all";
    static AREA_DISTRICTS_INSTITUTIONS = "/area/districts/institutions";
    static AREA_CODE = "/area/{areaCode}";
    
}