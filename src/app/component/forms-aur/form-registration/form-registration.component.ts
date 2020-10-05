import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';
import { ScoutingSections, SessionConstant } from 'src/app/constant/Constants';
import { EnumUtil, InstitutionCategory, SectionCode } from 'src/app/constant/Enums';
import { AURFormMessages } from '../../../constant/Messages';
import { RosterHeaderLabels } from '../../../constant/RosterHeaderLabels';
import { AURFormGroup } from '../../../formGroups/AURFormGroup';
import { AURFormRegistration, RegistrationFees } from '../../../model/aur-form-registration.model';
import { InstitutionModel, UnitNumberModel } from '../../../model/entities.model';
import { FormRegistrationService } from '../../../service/aur-form-registration.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

@Component({
  selector: 'app-form-registration',
  templateUrl: './form-registration.component.html',
  styleUrls: ['../aur-form.component.css']
})
export class FormRegistrationComponent implements OnInit {

  // Declare object
  aurFormObj: AURFormRegistration;
  private allowedSections: string[];

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
  canBeSelected: boolean;

  constructor(
    public  router: Router,
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
    this.canBeSelected = true;
    this.disableSubmit();
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    
    // Initialize Input Fields
    this.aubFormGroup.createForm();
    let institutionId = window.sessionStorage[SessionConstant.USER_INSTITUTION_ID_KEY];
    this.aubFormGroup.institutionId.setValue(institutionId);
    this.service.initializeAUR(this.aurFormObj, this.aubFormGroup).subscribe((institution: InstitutionModel) => {
      this.setAllowedSectionByInstitutionCategory();
    });

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
    let messages = [AURFormMessages.GENERAL_INSTRUCTIONS_1, 
      AURFormMessages.GENERAL_INSTRUCTIONS_2, AURFormMessages.GENERAL_INSTRUCTIONS_3];
    this.councilDialog.openDialog(AURFormMessages.GENERAL_INSTRUCTIONS_TITLE, messages);
  }

  keyPressed(event) {
    // Enter Key is #13
    if (event.keyCode === 13) { 
      this.calculateFees();
    }
  }

  calculateFees() {
    if(this.hasErrors()) {
      this.disableSubmit();
      return;
    }
    this.service.populateAurFormObj(this.aurFormObj, this.aubFormGroup);
    this.service.calculateFees(this.aurFormObj, this.registrationFee);
    
    // Check Total Amount
    if (this.registrationFee.totalAmount <= 0) {
      this.councilDialog.openDialog(AURFormMessages.SUBMISSION_ERROR, [AURFormMessages.REGISTRATION_FEE_NOT_CALCULATED]);
      this.disableSubmit();
    } else {
      this.submitDisabled = false;
    }
  }

  onFormSubmit() {
    if(this.hasErrors()) {
      this.disableSubmit();
      return;
    }
    
    this.councilDialog.openConfirmDialog(AURFormMessages.SUBMISSION_CONFIRMATION_TITLE, AURFormMessages.SUBMISSION_CONFIRMATION_MESSAGE)
      .subscribe(confirmResult => {
        if (confirmResult) {
          this.service.submitAURForm(this.aurFormObj).subscribe(
            () => {
              let messages = [];
              messages.push(AURFormMessages.SUBMISSION_SUCCESSFUL_TEXT_1);
              messages.push(AURFormMessages.SUBMISSION_SUCCESSFUL_TEXT_2);
              this.councilDialog.openDialog(AURFormMessages.SUBMISSION_SUCCESSFUL_TITLE, messages);
              
              // Route to AUR Forms List
              this.aubFormGroup.form.reset();
              this.router.navigateByUrl('/forms');
            },
            error => {
              this.disableSubmit();
            }
          );
        }
      });
  }

  private hasErrors(): boolean {
    this.errorMessages = [];
    
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
      let sectionText = selectedUnitNumber.split("-")[0];
      switch(sectionText) {
        case "KID": sectionElement = this.elementRef.nativeElement.querySelector(`#Langkay`);
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
        case "RS": sectionElement = this.elementRef.nativeElement.querySelector(`#Circle`);
                  sectionElement.style = "text-decoration:underline;font-weight:bold;";
                  this.aubFormGroup.sectionCode.setValue(SectionCode.CIRCLE);
                  break;
        default:  
          this.councilDialog.openDialog(AURFormMessages.UNIT_NUMBER_NEW_TITLE, 
            [AURFormMessages.UNIT_NUMBER_NEW_MESSAGE, AURFormMessages.SECTION_CODE_NOT_SET]);
          this.aubFormGroup.sectionCode.setValue(null);
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
    // If selected Unit Number is "New"
    if (this.aubFormGroup.unitNumber.value == 'New') {
      this.resetSectionStyles();
      
      // Disallow Section if not appropriate for user's institution 
      if (!this.allowedSections.includes(selectedSection)) {
        this.councilDialog.openDialog(AURFormMessages.INVALID_PROCESS, [AURFormMessages.INVALID_SECTION_CODE]);
        this.disableSubmit();
        return;
      }

      // Set Section Code
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
      this.councilDialog.openDialog(AURFormMessages.INVALID_PROCESS, [AURFormMessages.SECTION_CODE_NOT_NEW]);
      this.disableSubmit();
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

   private setAllowedSectionByInstitutionCategory() {
    this.allowedSections = [];
    switch (this.aurFormObj.institutionCategory) {
      case InstitutionCategory.PRESCHOOL:
        this.allowedSections.push(ScoutingSections.categories[0].text); 
        break;
      case InstitutionCategory.PRIMARY:
        this.allowedSections.push(ScoutingSections.categories[0].text, 
          ScoutingSections.categories[1].text,
          ScoutingSections.categories[2].text); 
        break;
      case InstitutionCategory.SECONDARY:
        this.allowedSections.push(ScoutingSections.categories[3].text,); 
        break;
      case InstitutionCategory.SENIOR_HIGH:
      case InstitutionCategory.COLLEGE:
        this.allowedSections.push(ScoutingSections.categories[4].text); 
        break;
      case InstitutionCategory.COMMUNITY:
        this.allowedSections.push(ScoutingSections.categories[0].text,
          ScoutingSections.categories[1].text,
          ScoutingSections.categories[2].text,
          ScoutingSections.categories[3].text,
          ScoutingSections.categories[4].text); 
        break;
    }
   }
}