import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsListService } from '../../service/forms-list.service';
import { SearchFormModel } from '../../model/search-form.model';
import { AURFormListFormGroup } from '../../formGroups/FormListGroup';
import { FormListSearchResultsModel } from '../../model/form-list.model';

@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormsListComponent implements OnInit {

  // Declare combo box data
  searchFormData: SearchFormModel;

  // Set destination value
  selectedDistrict: string;
  selectedArea: string;
  selectedInstitution: string;

  // Set table data
  dataSource: Array<FormListSearchResultsModel>;
  displayedColumns: string[] = ['dateApplied', 'district', 'institution', 'aurNumber', 'status', 'lastUpdatedDate'];

  constructor(
    public  route: ActivatedRoute,
    public  router: Router,
    private service: FormsListService,
    public aurFormListFormGroup: AURFormListFormGroup
  ) {
    this.dataSource = new Array<FormListSearchResultsModel>();
    let blankForm = new FormListSearchResultsModel();
    this.dataSource.push(blankForm);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // this.name = params['name'];
    }); 

    // Populate Search Boxes
    this.searchFormData = this.service.initializeSearchBoxes();

    // Set Default Values
    this.selectedArea = this.searchFormData.areaList[0];
    this.selectedDistrict = this.searchFormData.districtList[0];
    this.selectedInstitution = Object.keys(this.searchFormData.institutionMap).find(() => {});
  }

  repopulateInstitutions() {
    this.service.populateSearchBoxes(this.searchFormData, this.selectedArea, this.selectedDistrict);
  }

  repopulateDistrictAndInstitutions() {
    this.service.populateSearchBoxes(this.searchFormData, this.selectedArea, null);
  }

  searchAURForms() {
    this.service.searchAURForm(this.aurFormListFormGroup).then((data: Array<FormListSearchResultsModel>) => {
      this.dataSource = data;
    });
  }

  selectForm(id: any) {
    // Navigate to Form
    if (id) {
      this.router.navigateByUrl('/forms/'+id);
    }
  }
}
