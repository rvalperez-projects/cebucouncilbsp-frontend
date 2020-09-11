import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { MasterMessages } from 'src/app/constant/Messages';
import { SearchFormGroup } from 'src/app/formGroups/FormListGroup';
import { UnitNumberModel } from 'src/app/model/entities.model';
import { SearchFormModel, UnitNumberSearchResult } from 'src/app/model/search-form.model';
import { MasterUnitNumberService } from 'src/app/service/master-unit-number.service';
import { SearchService } from 'src/app/service/search.service';
import { CouncilDialog } from '../../common-components/dialog/create-dialog-util';

@Component({
  selector: 'app-unit-number',
  templateUrl: './unit-number.component.html',
  styleUrls: ['./unit-number.component.css']
})
export class UnitNumberComponent implements OnInit {

  // Declare combo box data
  searchFormData: SearchFormModel;
  institutionUnitNumbers: string[];
  availableUnitNumbers: string[];

  selectedInstitutionUnitNumbers: string[];
  selectedAvailableUnitNumbers: string[];

  constructor(
    private searchService: SearchService,
    private unitNumberMasterService: MasterUnitNumberService,
    private header: AppComponent,
    public searchFormGroup: SearchFormGroup,
    private cdRef: ChangeDetectorRef,
    private councilDialog: CouncilDialog
  ) {
    this.searchFormData = new SearchFormModel();
    this.institutionUnitNumbers = new Array<string>();
    this.availableUnitNumbers = new Array<string>();
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();
    
    // Populate Search Boxes
     this.searchService.initializeSearchBoxes().subscribe((result: any) => {
       
      let mapResult = result as Map<string, Map<string, Map<number, string>>>;
      let area: string = Object.keys(mapResult)[0];
      let district: string = Object.keys(mapResult[area])[0];

      this.searchFormGroup.area.setValue(area);
      this.searchFormGroup.district.setValue(district);
      this.searchFormGroup.institutionId.setValue('');
      this.searchService.populateSearchBoxes(this.searchFormData, area, district);
     });
  }
  
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  repopulateInstitutions() {
    this.searchService.populateSearchBoxes(this.searchFormData, 
      this.searchFormGroup.area.value, 
      this.searchFormGroup.district.value);
    this.searchFormGroup.institutionId.setValue(null);
  }

  repopulateDistrictAndInstitutions() {
    this.searchService.populateSearchBoxes(this.searchFormData, 
      this.searchFormGroup.area.value, null);
      this.searchFormGroup.district.setValue(null);
      this.searchFormGroup.institutionId.setValue(null);
  }

  searchUnitNumbers() {
    if (this.hasMissingInput()) {
      return;
    }
    
    this.institutionUnitNumbers = [];
    this.availableUnitNumbers = [];
    this.unitNumberMasterService.searchUnitNumbers(this.searchFormGroup.institutionId.value)
      .subscribe((result: UnitNumberSearchResult) => {
        for (let item of result.institutionUnitNumbers) {
          let model = item as UnitNumberModel;
          this.institutionUnitNumbers.push(model.unitNumber);
        }
        for (let item of result.availableUnitNumbers) {
          let model = item as UnitNumberModel;
          this.availableUnitNumbers.push(model.unitNumber);
        }
    });
  }

  createNewUnitNumber() {
    if (this.hasMissingInput()) {
      return;
    }
    this.councilDialog.createNewUnitNumber().subscribe((unitNumberModel: UnitNumberModel) => {
      // Call Create Unit Number API
      if (unitNumberModel) {
        unitNumberModel.institutionId = this.searchFormGroup.institutionId.value;
        this.unitNumberMasterService.createNewUnitNumber(unitNumberModel).subscribe(() => {
          this.searchUnitNumbers();
        });
      }
    });
  }

  removeUnitNumber() {
    if (this.hasMissingInput()) {
      return;
    }
    let unitNumbers = new Array<UnitNumberModel>();
    for (let index in this.selectedInstitutionUnitNumbers) {
      let unitNumberModel = new UnitNumberModel();
      unitNumberModel.unitNumber = this.selectedInstitutionUnitNumbers[index];
      unitNumberModel.institutionId = null;
      unitNumbers.push(unitNumberModel);
    }
    if(unitNumbers) {
      this.unitNumberMasterService.updateUnitNumber(unitNumbers).subscribe(() => {
        this.searchUnitNumbers();
      });
    }
  }

  addUnitNumber() {
    if (this.hasMissingInput()) {
      return;
    }
    let unitNumbers = new Array<UnitNumberModel>();
    for (let index in this.selectedAvailableUnitNumbers) {
      let unitNumberModel = new UnitNumberModel();
      unitNumberModel.unitNumber = this.selectedAvailableUnitNumbers[index];
      unitNumberModel.institutionId = this.searchFormGroup.institutionId.value;
      unitNumbers.push(unitNumberModel);
    }
    if(unitNumbers) {
      this.unitNumberMasterService.updateUnitNumber(unitNumbers).subscribe(() => {
        this.searchUnitNumbers();
      });
    }
  }

  private hasMissingInput(): boolean {
    let result = false;
    if (!this.searchFormGroup.area.value || 
      !this.searchFormGroup.district.value ||
      !this.searchFormGroup.institutionId.value) {
      this.councilDialog.openDialog(MasterMessages.INCOMPLETE_DATA, [MasterMessages.ALL_SEARCH_VALUES_REQUIRED]);
      result = true;
    }
    return result;
  }

}
