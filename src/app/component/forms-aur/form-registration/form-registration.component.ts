import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { SessionConstant } from 'src/app/constant/Constants';
import { EnumUtil, SectionCode } from 'src/app/constant/Enums';
import { AURFormMessages, ResponseErrorMessages } from '../../../constant/Messages';
import { RosterHeaderLabels } from '../../../constant/RosterHeaderLabels';
import { AURFormGroup } from '../../../formGroups/AURFormGroup';
import { AURFormRegistration, RegistrationFees } from '../../../model/aur-form-registration.model';
import { UnitNumberModel } from '../../../model/entities.model';
import { FormRegistrationService } from '../../../service/form-registration.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

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
  highestBadgeBox: Map<string,string>;
  registrationStatusBox: Array<string> = RosterHeaderLabels.registrationStatusCode;
  unitNumbersBox: Array<string>;

  // Registration Fee Counters
  registrationFee: RegistrationFees;

  // Error Messages
  errorMessages: Array<string>;
  submitDisabled: boolean;
  circlePositions: Array<string>;

  constructor(
    private elementRef : ElementRef, 
    private service : FormRegistrationService,
    private councilDialog: CouncilDialog, 
    private header: AppComponent,
    public aubFormGroup: AURFormGroup ) {

    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
    this.errorMessages = new Array<string>();
    this.unitNumbersBox = new Array<string>();
    this.highestBadgeBox = new Map<string,string>();
    this.submitDisabled = true;
    this.circlePositions = [
      RosterHeaderLabels.memberPositions[1].code, 
      RosterHeaderLabels.memberPositions[2].code, 
      RosterHeaderLabels.memberPositions[3].code
    ];
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    
    // Initialize Input Fields
    let institutionId = window.sessionStorage[SessionConstant.USER_INSTITUTION_ID_KEY];
    this.aubFormGroup.institutionId.setValue(institutionId);
    this.service.initializeAUR(this.aurFormObj, this.aubFormGroup);

    // Initialize Unit Numbers Combo Box
    this.service.getInstitutionUnitNumbers(institutionId).subscribe((unitNumbers: UnitNumberModel[]) => {
      for (let unitNum of unitNumbers) {
        this.unitNumbersBox.push(unitNum.unitNumber);
      }
      this.unitNumbersBox.push("New");

      if (this.hasCircleUnitNum()) {
        this.enableNotCircleInputs();
      } else {
        this.disableNotCircleInputs();
      }
    });

    // Show General Instructiosn
    let messages = [AURFormMessages.GENERAL_INSTRUCTIONS_1, AURFormMessages.GENERAL_INSTRUCTIONS_2]
    this.councilDialog.openDialog(AURFormMessages.GENERAL_INSTRUCTIONS_TITLE, messages);
  }

  calculateFees() {
    this.service.populateAurFormObj(this.aurFormObj, this.aubFormGroup);
    this.service.calculateFees(this.aurFormObj, this.registrationFee);
    if (this.registrationFee.totalAmount > 0) {
      this.submitDisabled = false;
    }
  }

  onFormSubmit() {
    if(!this.hasErrors()) {
      this.service.submitAURForm(this.aurFormObj).subscribe(
        () => {
          let messages = [AURFormMessages.SUBMISSION_SUCCESSFUL_TEXT];
          this.councilDialog.openDialog(AURFormMessages.SUBMISSION_SUCCESSFUL_TITLE, messages);
        },
        error => {
          let messages = [ResponseErrorMessages.CONTACT_ADMIN];
          this.councilDialog.openDialog(AURFormMessages.SUBMISSION_FAILED, messages);
        }
      );
    }
  }

  private hasErrors(): boolean {
    this.errorMessages = [];
    // Check Total Amount
    if (this.registrationFee.totalAmount == 0) {
      this.errorMessages.push(AURFormMessages.REGISTRATION_FEE_NOT_CALCULATED);
    }
    
    // Check Input Data
    this.aubFormGroup.checkInputData(this.errorMessages);
    if (this.errorMessages.length > 0) {      
      this.councilDialog.openDialog(AURFormMessages.SUBMISSION_ERROR, this.errorMessages);
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
                  this.aubFormGroup.sectionCode.setValue(SectionCode.LANGKAY);
                  break;
        case "K": sectionElement = this.elementRef.nativeElement.querySelector(`#Kawan`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue(SectionCode.KAWAN);
                  break;
        case "T": sectionElement = this.elementRef.nativeElement.querySelector(`#Troop`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue(SectionCode.TROOP);
                  break;
        case "S": sectionElement = this.elementRef.nativeElement.querySelector(`#Outfit`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue(SectionCode.OUTFIT);
                  break;
        case "R": sectionElement = this.elementRef.nativeElement.querySelector(`#Circle`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue(SectionCode.CIRCLE);
                  break;
        default:  this.aubFormGroup.sectionCode.setValue(null);
      }

      let sectionCode = this.aubFormGroup.sectionCode.value;
      this.refreshHighestBadges(sectionCode);

      // Disable ARL and Auditor row input fields
      if (sectionCode != SectionCode.CIRCLE) {
        this.disableNotCircleInputs();
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
      if (selectedSection.toLowerCase() != 
        EnumUtil.getEnumTextByValue(SectionCode, SectionCode.CIRCLE).toLowerCase()) {
        this.disableNotCircleInputs();
      }
      this.refreshHighestBadges(this.aubFormGroup.sectionCode.value);
    } else {
      this.errorMessages = [];
      this.errorMessages.push(AURFormMessages.SECTION_CODE_NOT_NEW);
      this.councilDialog.openDialog(AURFormMessages.INVALID_PROCESS, this.errorMessages);
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
    this.submitDisabled = true;
  }

  public disableSubmit() {
    this.submitDisabled = true;
  }

  // HELPER FUNCTIONS
  private resetSectionStyles() {
    RosterHeaderLabels.sectionCodes.forEach((value: string, key: string) => {
        let sectionElement = this.elementRef.nativeElement.querySelector(`#`.concat(value));
        sectionElement.style = "";
        this.aubFormGroup.sectionCode.setValue(null);
    });
    this.enableNotCircleInputs();
    this.highestBadgeBox.clear();
  }

  private disableNotCircleInputs() {
    for (let i=1; i<=3; i++) {
      let memberFormGroup = this.aubFormGroup.unitMembersList.controls[i] as FormGroup;
      memberFormGroup.controls['surname'].setValue('');
      memberFormGroup.controls['givenName'].setValue('');
      memberFormGroup.controls['middleInitial'].setValue('');
      memberFormGroup.controls['registrationStatusCode'].setValue('');
      memberFormGroup.controls['age'].setValue('');
      memberFormGroup.controls['highestBadgeCode'].setValue('');
      memberFormGroup.controls['tenure'].setValue('');
      memberFormGroup.controls['religion'].setValue('');
      
      memberFormGroup.controls['surname'].disable();
      memberFormGroup.controls['givenName'].disable();
      memberFormGroup.controls['middleInitial'].disable();
      memberFormGroup.controls['registrationStatusCode'].disable();
      memberFormGroup.controls['age'].disable();
      memberFormGroup.controls['highestBadgeCode'].disable();
      memberFormGroup.controls['tenure'].disable();
      memberFormGroup.controls['religion'].disable();
    }
  }

  private enableNotCircleInputs() {
    for (let i=1; i<=3; i++) {
      let memberFormGroup = this.aubFormGroup.unitMembersList.controls[i] as FormGroup;      
      memberFormGroup.controls['surname'].enable();
      memberFormGroup.controls['givenName'].enable();
      memberFormGroup.controls['middleInitial'].enable();
      memberFormGroup.controls['registrationStatusCode'].enable();
      memberFormGroup.controls['age'].enable();
      memberFormGroup.controls['highestBadgeCode'].enable();
      memberFormGroup.controls['tenure'].enable();
      memberFormGroup.controls['religion'].enable();
    }
  }

  private hasCircleUnitNum() {
    for (let unitNum of this.unitNumbersBox) {
      if (unitNum.includes("R")) {
        return true;
      }
    }
    return false;
  }

  private refreshHighestBadges(sectionCode: string) {
    this.highestBadgeBox.clear();
    for (let [key, value] of RosterHeaderLabels.highestBadge) {
      if (key == '' || key == "00") {
        this.highestBadgeBox.set(key, value);
        continue;
      }
      switch(sectionCode) {
        case SectionCode.KAWAN: if (key.startsWith("1")) this.highestBadgeBox.set(key, value); break;
        case SectionCode.TROOP: if (key.startsWith("2")) this.highestBadgeBox.set(key, value); break;
        case SectionCode.OUTFIT: if (key.startsWith("3")) this.highestBadgeBox.set(key, value); break;
        case SectionCode.CIRCLE: if (key.startsWith("4")) this.highestBadgeBox.set(key, value); break;
      }
    }
   }

}