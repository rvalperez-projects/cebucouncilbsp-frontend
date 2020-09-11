import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ScoutingSections } from 'src/app/constant/Constants';
import { SectionCode } from 'src/app/constant/Enums';
import { UnitNumberModel } from 'src/app/model/entities.model';

@Component({
  selector: 'app-new-unit-number',
  templateUrl: './new-unit-number.component.html',
  styleUrls: ['./new-unit-number.component.css']
})
export class NewUnitNumberComponent {

  // Input
  unitNumberInput: string;
  sectionCodeInput: string;

  sectionCodes: any;

  constructor(
    public dialogRef: MatDialogRef<NewUnitNumberComponent>) {
    this.sectionCodes = ScoutingSections.categories;
  }

  confirm() {
    if (!this.unitNumberInput || 
      (this.unitNumberInput && this.unitNumberInput.trim().length == 0)) {
      this.close();
    } else {
      let unitNumberModel = new UnitNumberModel();
      unitNumberModel.unitNumber = this.unitNumberInput.toUpperCase();
      unitNumberModel.sectionCode = this.sectionCodeInput;
      this.dialogRef.close(unitNumberModel);
    }
  }

  close() {
    // Close dialog
    this.dialogRef.close(null);
  }

  appendPrefix() {
    switch (this.sectionCodeInput) {
      case SectionCode.LANGKAY: this.unitNumberInput = "L-"; break;
      case SectionCode.KAWAN: this.unitNumberInput = "K-"; break;
      case SectionCode.TROOP: this.unitNumberInput = "T-"; break;
      case SectionCode.OUTFIT: this.unitNumberInput = "S-"; break;
      case SectionCode.CIRCLE: this.unitNumberInput = "R-"; break;
    }
  }

}
