import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';
import { RosterHeaderLabels } from '../../../constant/RosterHeaderLabels';
import { AURFormGroup } from '../../../formGroups/AURFormGroup';
import { AURFormRegistration, RegistrationFees } from '../../../model/aur-form-registration.model';
import { AURFormViewService } from '../../../service/aur-form-view.service';

@Component({
  selector: 'app-aur-form-view',
  templateUrl: './aur-form-view.component.html',
  styleUrls: ['./aur-form-view.component.css']
})
export class AurFormViewComponent implements OnInit {

  // Declare object
  aurFormObj: AURFormRegistration;
  loading: boolean;
  
  // Declare labels
  iSComPositions = RosterHeaderLabels.iSComPositions;
  memberPositions = RosterHeaderLabels.memberPositions;

  // Combo box values
  highestTrainingBox = RosterHeaderLabels.highestTraining;
  highestBadgeBox = RosterHeaderLabels.highestBadge;
  
  // Registration Fee Counters
  registrationFee: RegistrationFees;

  constructor(
    public  router: Router,
    private service : AURFormViewService,
    private header: AppComponent,
    public aubFormGroup: AURFormGroup ) {

    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
  }

  ngOnInit(): void {
    this.header.initLoggedInUser();    
    this.loading = true;
    
    // Route back to forms if no formId is retrieved
    if (!history.state.formId) {
      this.router.navigateByUrl("/forms");
    } else {
      this.aurFormObj.formId = history.state.formId;
      this.service.initializeAUR(this.aurFormObj, this.registrationFee).subscribe(() => {
        this.loading = false;
      });
    }
  }

  print() {
    
  }
}
