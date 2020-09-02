export abstract class AURFormMessages {

    static INVALID_PROCESS = "Invalid Process";
    static SUBMISSION_ERROR = "Incomplete Data";
    static INCOMPLETE_DATA = "There are missing or incomplete required data. Please review.";
    static SECTION_CODE_NOT_NEW = "Section Category can only be set when Unit No. [New] is selected.";
    static REGISTRATION_FEE_NOT_CALCULATED = "Please calculate total Registration Fees first. ";

    static UNIT_NUMBER_NOT_SET = "Unit Number not set.";
    static SECTION_CODE_NOT_SET = "Please select any of the following: \n\tLangkay / Kawan / Troop / Outfit / Circle.";

    static SUBMISSION_FAILED = "Submission Failed";
    static SUBMISSION_SUCCESSFUL_TITLE = "Submission Successful";
    static SUBMISSION_SUCCESSFUL_TEXT = "Application for Unit Registration Form submission has been successful."

    static PROCESSING_FAILED = "Processing AUR Form Failed";
    static PROCESSING_SUCCESSFUL_TITLE = "AUR Update Successful";
    static PROCESSING_SUCCESSFUL_TEXT = "Application for Unit Registration update has been successful."
    
    static RETRIEVAL_FAILED = "AUR Form Details Retrieval Failed";
    static GENERAL_INSTRUCTIONS_TITLE = "General Instructions";
    static GENERAL_INSTRUCTIONS_1 = "Please set [Unit Number] and [Scouting Section] values first (found below) to disable unnecessary input fields.";
    static GENERAL_INSTRUCTIONS_2 = "When filling out the form is complete, please click on [Calculate Fees] button to calculate total amount to be paid.";

    static OFFICIAL_RECEIPT_NO_BLANK = "Official Receipt No. not updated.";
    static OFFICIAL_RECEIPT_DATE_BLANK = "Official Receipt Date not updated.";
    static OFFICIAL_RECEIPT_DATE_FUTURE = "Official Receipt Date must NOT be later than today."
    static UNIT_REGISTRATION_NO_BLANK = "Unit Registration No. not updated.";

    static MISSING_MEMBERSHIP_CERT_NO = " missing [Membership Cert. No.].";

    static DELETION_FAILED = "AUR Form Deletion Failed";
    static DELETION_SUCCESSFUL = "AUR Form Deletion Successful";
    static DELETION_SUCCESSFUL_MESSAGE = "Redirecting you back to the AUR Forms List page.";
}

export abstract class ProfileFormMessages {
    
    static SUBMISSION_SUCCESSFUL = "Submission Successful";
    static WELCOME_MESSAGE_1 = "Welcome to the Cebu Council BSP Portal.";
    static WELCOME_MESSAGE_2 = "Login to register your unit.";
    static SUBMISSION_ERROR = "Incomplete Data";
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
    static INTERNAL_SERVER_ERROR = "Internal Server Error";
    static CONTACT_ADMIN = "Please contact Systems Administrator.";
    static NOT_ENOUGH_RIGHTS = "User does not have enough privileges to view this page.";
}