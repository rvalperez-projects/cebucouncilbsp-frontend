export abstract class ResourceURL {

    // TODO Set to Environment Properties
    // static HOST = "http://localhost:8080";
    static HOST = "https://cebucouncilbsp.herokuapp.com";

    static LOGIN = "/auth/login";
    static LOGOUT = "/auth/logout";
    static SIGN_UP = "/user/sign-up";
    static USER_SEARCH = "/user/search";
    static FORM_SUBMIT = "/form/submit";
    static FORM_DISPLAY = "/form/{formId}";
    static FORM_SEARCH = "/form/search";
    static FORM_UPDATE = "/form/update";
    static FORM_UPDATE_STATUS = "/form/update-status";
    static INSTITUTION_ALL = "/institution/all";
    static INSTITUTION_ID = "/institution/{institutionId}";
    static INSTITUTION_UNIT_NUMBERS = "/institution/unitNumbers/{institutionId}";
    static AREA_ALL = "/area/all";
    static AREA_DISTRICTS_INSTITUTIONS = "/area/districts/institutions";
    static AREA_CODE = "/area/{areaCode}";
    
}