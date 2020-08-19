import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { RosterHeaderLabels } from '../../constant/RosterHeaderLabels';
import { AURFormRegistration, RegistrationFees } from '../../model/aur-form-registration.model';
import { AURFormViewService } from '../../service/aur-form-view.service';
import { AURFormGroup } from '../../formGroups/AURFormGroup';
import { CouncilDialog } from '../dialog/create-dialog-util';

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
    private route: ActivatedRoute,
    private elementRef : ElementRef, 
    private service : AURFormViewService,
    private councilDialog: CouncilDialog, 
    public aubFormGroup: AURFormGroup ) {

    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
  }

  ngOnInit(): void {
    this.loading = true;
    this.aurFormObj.formId = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.service.initializeAUR(this.aurFormObj, this.registrationFee).subscribe(() => {
      this.loading = false;
    });
  }

  updateStatus() {

  }
  
  processAURForm() {

  }

  print() {
    
  }
}
