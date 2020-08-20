import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RosterHeaderLabels } from '../../constant/RosterHeaderLabels';
import { AURFormRegistration, RegistrationFees } from '../../model/aur-form-registration.model';
import { FormRegistrationService } from '../../service/form-registration.service';
import { AURFormGroup } from '../../formGroups/AURFormGroup';
import { AURFormErrorMessages, ResponseErrorMessages } from '../../constant/Messages';
import { CouncilDialog } from '../dialog/create-dialog-util';
import { SessionConstant } from 'src/app/constant/Constants';

@Component({
  selector: 'app-form-registration',
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.css'],
  providers:  [ FormRegistrationService, AURFormGroup ]
})
export class FormRegistrationComponent implements OnInit {

  // Declare object
  aurFormObj: AURFormRegistration;

  // Declare labels
  iSComPositions = RosterHeaderLabels.iSComPositions;
  memberPositions = RosterHeaderLabels.memberPositions;

  // Combo box values
  highestTrainingBox: Map<string,string> = RosterHeaderLabels.highestTraining;
  highestBadgeBox: Map<string,string> = RosterHeaderLabels.highestBadge;
  registrationStatusBox: Array<string> = RosterHeaderLabels.registrationStatusCode;
  unitNumbersBox: Array<string>;

  // Registration Fee Counters
  registrationFee: RegistrationFees;

  // Error Messages
  errorMessages: Array<string>;

  constructor(
    private elementRef : ElementRef, 
    public  router: Router,
    private service : FormRegistrationService,
    private councilDialog: CouncilDialog, 
    public aubFormGroup: AURFormGroup ) {

    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
    this.errorMessages = new Array<string>();
    this.unitNumbersBox = new Array<string>();
  }

  ngOnInit(): void {
    let institutionId = window.sessionStorage[SessionConstant.USER_INSTITUTION_ID_KEY];
    this.aubFormGroup.institutionId.setValue(institutionId);
    this.service.initializeAUR(this.aurFormObj, this.aubFormGroup);
    this.service.getInstitutionUnitNumbers(this.unitNumbersBox, institutionId);
  }

  calculateFees() {
    this.service.populateAurFormObj(this.aurFormObj, this.aubFormGroup);
    this.service.calculateFees(this.aurFormObj, this.registrationFee);
  }

  onFormSubmit() {
    if(!this.hasErrors()) {
      this.service.submitAURForm(this.aurFormObj).subscribe(
        () => {
          let messages = [AURFormErrorMessages.SUBMISSION_SUCCESSFUL_TEXT];
          this.councilDialog.openDialog(AURFormErrorMessages.SUBMISSION_SUCCESSFUL_TITLE, messages);
        },
        error => {
          let messages = [ResponseErrorMessages.CONTACT_ADMIN];
          this.councilDialog.openDialog(AURFormErrorMessages.SUBMISSION_FAILED, messages);
        }
      );
    }
  }

  private hasErrors(): boolean {
    this.errorMessages = [];
    // Check Total Amount
    if (this.registrationFee.totalAmount == 0) {
      this.errorMessages.push(AURFormErrorMessages.REGISTRATION_FEE_NOT_CALCULATED);
    }
    
    // Check Input Data
    this.aubFormGroup.checkInputData(this.errorMessages);
    if (this.errorMessages.length > 0) {      
      this.councilDialog.openDialog(AURFormErrorMessages.SUBMISSION_ERROR, this.errorMessages);
      return true;
    }
    return false;
  }

  onUnitNumberChange(selectedUnitNumber: string) {
    this.resetSectionStyles();
    if (selectedUnitNumber.length > 0) {
      this.aubFormGroup.unitNumber.setValue(selectedUnitNumber);
      let sectionElement: any;
      switch(selectedUnitNumber.charAt(0)) {
        case "L": sectionElement = this.elementRef.nativeElement.querySelector(`#Langkay`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue("00");
                  break;
        case "K": sectionElement = this.elementRef.nativeElement.querySelector(`#Kawan`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue("01");
                  break;
        case "T": sectionElement = this.elementRef.nativeElement.querySelector(`#Troop`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue("02");
                  break;
        case "S": sectionElement = this.elementRef.nativeElement.querySelector(`#Outfit`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue("03");
                  break;
        case "R": sectionElement = this.elementRef.nativeElement.querySelector(`#Circle`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue("04");
                  break;
        default:  this.aubFormGroup.sectionCode.setValue(null);
      }
    }
  }

  setSectionCode(selectedSection: string) {
    if (this.aubFormGroup.unitNumber.value == 'New') {
      this.resetSectionStyles();
      RosterHeaderLabels.sectionCodes.forEach((value: string, key: string) => {
        if (value == selectedSection) {
          this.aubFormGroup.sectionCode.setValue(key);
          let sectionElement = this.elementRef.nativeElement.querySelector(`#`.concat(selectedSection));
          sectionElement.style = "text-decoration:underline;font-weight:bold;";
        }
      });
    } else {
      this.errorMessages = [];
      this.errorMessages.push(AURFormErrorMessages.SECTION_CODE_NOT_NEW);
      this.councilDialog.openDialog(AURFormErrorMessages.INVALID_PROCESS, this.errorMessages);
    }
  }

  addCharterFee(checkbox) {
    if (checkbox.checked) {
      this.registrationFee.iSCCharterFee = 1;
    } else {
      this.registrationFee.iSCCharterFee = 0;
    }
    this.registrationFee.iSCCharterFeeTotal = this.registrationFee.iSCCharterFee * 10;
    this.registrationFee.calculateTotalAmount();
  }

  // HELPER FUNCTIONS
  private resetSectionStyles() {
    RosterHeaderLabels.sectionCodes.forEach((value: string, key: string) => {
        let sectionElement = this.elementRef.nativeElement.querySelector(`#`.concat(value));
        sectionElement.style = "";
        this.aubFormGroup.sectionCode.setValue(null);
    });
  }

}