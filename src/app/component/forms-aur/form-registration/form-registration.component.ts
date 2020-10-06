import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';
import { SessionConstant } from 'src/app/constant/Constants';
import { SectionCode } from 'src/app/constant/Enums';
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

    // Get Initial AUR Data
    this.service.initializeAUR(this.aurFormObj, this.aubFormGroup).subscribe((institution: InstitutionModel) => {

      // Get Unit Numbers
      this.service.getInstitutionUnitNumbers(institutionId).subscribe((unitNumbers: string[]) => {

        // Show General Instructions
        this.councilDialog.aurInputUnitNumber(institution.categoryCode, unitNumbers).subscribe((unitNumberModel: UnitNumberModel) => {
          // Call Create Unit Number API
          if (unitNumberModel) {
            this.aurFormObj.unitNumber = unitNumberModel.unitNumber;
            this.aurFormObj.sectionCode = unitNumberModel.sectionCode;
            this.aubFormGroup.unitNumber.setValue(unitNumberModel.unitNumber);
            this.aubFormGroup.sectionCode.setValue(unitNumberModel.sectionCode);
            
            // Enable / Disable input fields for Rover Scouts
            if (unitNumberModel.unitNumber.includes("R")) {
              this.enableNotCircleInputs();
            } else {
              this.disableNotCircleInputs();
            }

            // Underline selected Scouting Section
            this.setScoutingSection(unitNumberModel.sectionCode);
          }
        });
      });
    });
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

  private setScoutingSection(sectionCode: string) {
    let sectionElement: any = null;
    switch(sectionCode) {
      case SectionCode.LANGKAY: sectionElement = this.elementRef.nativeElement.querySelector(`#Langkay`);
                sectionElement.style = "text-decoration:underline;font-weight:bold;";
                this.aubFormGroup.sectionCode.setValue(SectionCode.LANGKAY);
                break;
      case SectionCode.KAWAN: sectionElement = this.elementRef.nativeElement.querySelector(`#Kawan`);
                sectionElement.style = "text-decoration:underline;font-weight:bold;";
                this.aubFormGroup.sectionCode.setValue(SectionCode.KAWAN);
                break;
      case SectionCode.TROOP: sectionElement = this.elementRef.nativeElement.querySelector(`#Troop`);
                sectionElement.style = "text-decoration:underline;font-weight:bold;";
                this.aubFormGroup.sectionCode.setValue(SectionCode.TROOP);
                break;
      case SectionCode.OUTFIT: sectionElement = this.elementRef.nativeElement.querySelector(`#Outfit`);
                sectionElement.style = "text-decoration:underline;font-weight:bold;";
                this.aubFormGroup.sectionCode.setValue(SectionCode.OUTFIT);
                break;
      case SectionCode.CIRCLE: sectionElement = this.elementRef.nativeElement.querySelector(`#Circle`);
                sectionElement.style = "text-decoration:underline;font-weight:bold;";
                this.aubFormGroup.sectionCode.setValue(SectionCode.CIRCLE);
                break;
    }
    this.refreshHighestBadges(sectionCode);
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