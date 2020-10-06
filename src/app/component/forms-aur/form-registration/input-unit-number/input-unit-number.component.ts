import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ScoutingSections } from 'src/app/constant/Constants';
import { InstitutionCategory, SectionCode } from 'src/app/constant/Enums';
import { AURFormMessages } from 'src/app/constant/Messages';
import { UnitNumberModel } from 'src/app/model/entities.model';

@Component({
  selector: 'app-input-unit-number',
  templateUrl: './input-unit-number.component.html',
  styleUrls: ['./input-unit-number.component.css']
})
export class InputUnitNumberComponent {

  // Input
  unitNumberInput: string;
  sectionCodeInput: string;

  sectionCodesBox: any;
  unitNumbersBox: Array<string>;

  // Temp
  sectionCodeTip: string;
  errorMessage: string;
  private unitNumberValues: Array<string>;

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<InputUnitNumberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.sectionCodesBox = new Array<string>();
      this.unitNumbersBox = new Array<string>();
      
      this.unitNumberValues = data.unitNumbers;
      this.filterSectionCategories(this.data.institutionCategory);
  }

  confirm() {
    this.errorMessage = null;
    if (!(this.unitNumberInput && this.sectionCodeInput)) {
      // Show error message
      this.errorMessage = AURFormMessages.SECTION_CODE_UNIT_NUMBER_NOT_SET;
    } else {
      let unitNumberModel = new UnitNumberModel();
      unitNumberModel.unitNumber = this.unitNumberInput;
      unitNumberModel.sectionCode = this.sectionCodeInput;
      this.dialogRef.close(unitNumberModel);
    }
  }

  close() {
    // Close dialog
    this.dialogRef.close(null);
    this.router.navigateByUrl('/forms');
  }

  filterUnitNumbers() {
    this.unitNumbersBox = [];
    for (let unitNum of this.unitNumberValues) {
      switch (this.sectionCodeInput) {
        case SectionCode.LANGKAY: 
          this.sectionCodeTip = "Kindergarten";
          if (unitNum.startsWith('KID-')) this.unitNumbersBox.push(unitNum); break;
        case SectionCode.KAWAN: 
          this.sectionCodeTip = "Grades 1 to 3";
          if (unitNum.startsWith('K-')) this.unitNumbersBox.push(unitNum); break;
        case SectionCode.TROOP: 
          this.sectionCodeTip = "Grades 4 to 6";
          if (unitNum.startsWith('T-')) this.unitNumbersBox.push(unitNum); break;
        case SectionCode.OUTFIT: 
          this.sectionCodeTip = "Junior High School";
          if (unitNum.startsWith('S-')) this.unitNumbersBox.push(unitNum); break;
        case SectionCode.CIRCLE: 
          this.sectionCodeTip = "Senior High to Young Adults";
          if (unitNum.startsWith('RS-')) this.unitNumbersBox.push(unitNum); break;
      }
    }
    this.unitNumbersBox.push("New");
    this.unitNumberInput = this.unitNumbersBox[0];
  }

  private filterSectionCategories(institutionCategory: string) {
    this.sectionCodesBox = [];
    switch (institutionCategory) {
      case InstitutionCategory.PRESCHOOL:
        this.sectionCodesBox.push(ScoutingSections.categories[0]); 
        break;
      case InstitutionCategory.PRIMARY:
        this.sectionCodesBox.push(ScoutingSections.categories[0], 
          ScoutingSections.categories[1],
          ScoutingSections.categories[2]); 
        break;
      case InstitutionCategory.SECONDARY:
        this.sectionCodesBox.push(ScoutingSections.categories[3]); 
        break;
      case InstitutionCategory.SENIOR_HIGH:
      case InstitutionCategory.COLLEGE:
        this.sectionCodesBox.push(ScoutingSections.categories[4]); 
        break;
      case InstitutionCategory.COMMUNITY:
        this.sectionCodesBox.push(ScoutingSections.categories[0],
          ScoutingSections.categories[1],
          ScoutingSections.categories[2],
          ScoutingSections.categories[3],
          ScoutingSections.categories[4]); 
        break;
    }
  }

}
