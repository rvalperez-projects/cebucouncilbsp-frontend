import { Component, OnInit, ElementRef } from '@angular/core';
import { RosterHeaderLabels } from '../../constant/RosterHeaderLabels';
import { AURFormRegistration, RegistrationFees } from '../../model/AURFormRegistration';
import { FormRegistrationService } from '../../service/form-registration.service';
import { AURFormGroup } from '../../formGroups/AURFormGroup';

@Component({
  selector: 'app-form-registration',
  templateUrl: './form-registration.component.html',
  styleUrls: ['./form-registration.component.css'],
  providers:  [ FormRegistrationService, AURFormGroup ]
})
export class FormRegistrationComponent implements OnInit {

  // Declare object
  public aurFormObj: AURFormRegistration;

  // Declare labels
  iSComPositions: Array<string> = RosterHeaderLabels.iSComPositions;
  memberPositions: Array<string> = RosterHeaderLabels.memberPositions;

  // Combo box values
  highestTrainingBox: Map<string,string> = RosterHeaderLabels.highestTraining;
  highestBadgeBox: Map<string,string> = RosterHeaderLabels.highestBadge;
  registrationStatusBox: Array<string> = RosterHeaderLabels.registrationStatusCode;
  unitNumbersBox: Array<string> = RosterHeaderLabels.unitNumbers;

  // Registration Fee Counters
  registrationFee: RegistrationFees;

  constructor(private elementRef : ElementRef, 
    private service : FormRegistrationService, public aubFormGroup: AURFormGroup) {
    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
  }

  ngOnInit(): void {
    this.service.initializeAUR(this.aurFormObj, this.aubFormGroup);
  }

  onFormSubmit() {
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
    this.resetSectionStyles();
    if (this.aubFormGroup.unitNumber.value == 'New') {
      RosterHeaderLabels.sectionCodes.forEach((value: string, key: string) => {
        if (value == selectedSection) {
          this.aubFormGroup.sectionCode.setValue(key);
          let sectionElement = this.elementRef.nativeElement.querySelector(`#`.concat(selectedSection));
          sectionElement.style = "text-decoration:underline;font-weight:bold;";
        }
      });
    } else {
      alert("Section Category can only be set when Unit No. [New] is selected.");
    }
  }

  calculateFees() {
    this.service.populateAurFormObj(this.aurFormObj, this.aubFormGroup);
    this.service.calculateFees(this.aurFormObj, this.registrationFee);
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
