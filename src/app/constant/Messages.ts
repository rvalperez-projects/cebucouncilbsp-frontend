export abstract class AURFormErrorMessages {

    static INVALID_PROCESS = "Invalid Process";
    static SUBMISSION_ERROR = "Incomplete Data";
    static INCOMPLETE_DATA = "There are missing or incomplete required data. Please review.";
    static SECTION_CODE_NOT_NEW = "Section Category can only be set when Unit No. [New] is selected.";
    static REGISTRATION_FEE_NOT_CALCULATED = "Please calculate total Registration Fees first. ";

    static UNIT_NUMBER_NOT_SET = "Unit Number not set.";
    static SECTION_CODE_NOT_SET = "Please select any of the following: \n\tLangkay / Kawan / Troop / Outfit / Circle.";
}

export abstract class ProfileErrorMessages {
    
    static REQUIRED = "Required Field";
    static INVALID_EMAIL_FORMAT = "Please enter a valid email address.";
}

export abstract class LoginErrorMessages {

    static INCOMPLETE_DATA = "Incomplete Data";
    static REQUIRED = "Username and Password inputs are required.";
    
    static INCORRECT_DATA = "Incorrect Input Data";
}

export abstract class ResponseErrorMessages {

    static ACCESS_FORBIDDEN = "Access Forbidden";
    static REDIRECT_LOGIN = "Redirecting to Login screen.";
}