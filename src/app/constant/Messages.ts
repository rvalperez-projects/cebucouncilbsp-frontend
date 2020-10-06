export abstract class AURFormMessages {

    static INVALID_PROCESS = "Invalid Process";
    static SUBMISSION_ERROR = "Incomplete Data";
    static INCOMPLETE_DATA = "There are missing or incomplete required data. Please review.";
    static REGISTRATION_FEE_NOT_CALCULATED = "Please input at least one registrant first to calculate total registration fees.";
    static SECTION_CODE_UNIT_NUMBER_NOT_SET = "Please select both values for Scouting Section and Unit Number.";

    static SUBMISSION_CONFIRMATION_TITLE = "AUR Form Submission";
    static SUBMISSION_CONFIRMATION_MESSAGE = "Inputted AUR Form will be submitted. Please confirm.";
    static SUBMISSION_FAILED = "Submission Failed";
    static SUBMISSION_SUCCESSFUL_TITLE = "Submission Successful";
    static SUBMISSION_SUCCESSFUL_TEXT_1 = "Application for Unit Registration Form submission has been successful."
    static SUBMISSION_SUCCESSFUL_TEXT_2 = "Confirmation Receipt has been sent to your email. Please check."

    static PROCESSING_CONFIRMATION_TITLE = "Process AUR Form";
    static PROCESSING_CONFIRMATION_MESSAGE = "Selected AUR Form will be submitted for processing. Please confirm.";
    static PROCESSING_FAILED = "Processing AUR Form Failed";
    static PROCESSING_SUCCESSFUL_TITLE = "AUR Update Successful";
    static PROCESSING_SUCCESSFUL_TEXT = "Application for Unit Registration update has been successful."
    
    static RETRIEVAL_FAILED = "AUR Form Details Retrieval Failed";
    static GENERAL_INSTRUCTIONS_TITLE = "General Instructions";

    static OFFICIAL_RECEIPT_NO_BLANK = "Official Receipt No. not updated.";
    static OFFICIAL_RECEIPT_DATE_BLANK = "Official Receipt Date not updated.";
    static OFFICIAL_RECEIPT_DATE_FUTURE = "Official Receipt Date must NOT be later than today."
    static UNIT_REGISTRATION_NO_BLANK = "Unit Registration No. not updated.";

    static MISSING_MEMBERSHIP_CERT_NO = " missing [Membership Cert. No.].";

    static DELETION_FAILED = "AUR Form Deletion Failed";
    static DELETION_SUCCESSFUL = "AUR Form Deletion Successful";
    static DELETION_SUCCESSFUL_MESSAGE = "Redirecting you back to the AUR Forms List page.";
    static DELETION_CONFIRMATION_TITLE = "AUR Form Deletion";
    static DELETION_CONFIRMATION_MESSAGE = "Selected AUR Form will be deleted. Please confirm.";

    static UPLOAD_PAYMENT_TITLE = "AUR Form Proof of Payment";
    static UPLOAD_PAYMENT_MESSAGE = "[<filename>] successfully uploaded.";
    static UPLOAD_PAYMENT_CONFIRM = "[<filename>] (<filesize> MB) is selected. Proceed to upload?";
    static UPLOAD_PAYMENT_FILESIZE_EXCEEDED = "[<filename>] is <filesize> MB. Please select a file less than 5 MB.";

    static PRINT_TITLE = "AUR Form Printing";
    static PRINT_CONFIRMATION = "Please set Paper Size to Legal (8.5in x 14in) or Long (8.5in x 13in) and remove Headers and Footers.";
}

export abstract class ProfileFormMessages {
    
    static RETRIEVAL_FAILED = "User Details Retrieval Failed";
    static SUBMISSION_SUCCESSFUL = "Submission Successful";
    static REGISTRATION_SUCCESSFUL_MESSAGE = "User Registration Successful";
    static UPDATE_SUCCESSFUL_MESSAGE = "User Update Successful. Please verify updated details in your registered email.";
    static SUBMISSION_ERROR = "Incomplete Data";
    static INVALID_EMAIL_FORMAT = "Please enter a valid email address.";
    static PASSWORDS_NOT_MATCH = "Inputted Passwords do not match.";
    
    static PROFILE_UPDATE_SUCCESSFUL = "Profile Update Successful";
    static RELOGIN = "You will be asked to relogin.";

    static WELCOME_MESSAGE_1 = "Welcome to the Cebu Council BSP Web Portal.";
    static WELCOME_MESSAGE_2 = "Registration details are sent to your email. Please verify.";
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

export abstract class MasterMessages {
    
    static INCOMPLETE_DATA = "Incomplete Data";
    static ALL_SEARCH_VALUES_REQUIRED = "Please provide a value for all search conditions.";

    static UNIT_NO_PROCESS_FAILED = "Unit Number Process Failed";
    static UNIT_NO_STILL_USED = "Unit Number still used. Can only be removed if not used after 2 years.";
}