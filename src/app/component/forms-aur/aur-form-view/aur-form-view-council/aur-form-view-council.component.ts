import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';
import { SessionConstant } from 'src/app/constant/Constants';
import { FormStatus, Roles } from 'src/app/constant/Enums';
import { AURFormMessages } from 'src/app/constant/Messages';
import { RosterHeaderLabels } from '../../../../constant/RosterHeaderLabels';
import { AURFormGroup } from '../../../../formGroups/AURFormGroup';
import { AURFormRegistration, RegistrationFees } from '../../../../model/aur-form-registration.model';
import { AURFormViewService } from '../../../../service/aur-form-view.service';
import { CouncilDialog } from '../../../common-components/dialog/create-dialog-util';

@Component({
  selector: 'app-aur-form-view-council',
  templateUrl: '../../aur-form-view/aur-form-view.component.html',
  styleUrls: ['aur-form-view-council.component.css']
})
export class AurFormViewCouncilComponent implements OnInit {

  // Declare object
  aurFormObj: AURFormRegistration;
  loading: boolean;
  isPaid: boolean;
  isGeneralUser: boolean;
  
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
    private councilDialog: CouncilDialog, 
    public aubFormGroup: AURFormGroup ) {

    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
    this.isGeneralUser = window.sessionStorage[SessionConstant.USER_ROLE_CODE_KEY] == Roles.GENERAL_USER;
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
        this.isPaid = this.aurFormObj.statusCode != FormStatus.SUBMITTED.valueOf();
      });
    }
  }

  deleteAURForm() {
    this.councilDialog.openConfirmDialog(AURFormMessages.DELETION_CONFIRMATION_TITLE, AURFormMessages.DELETION_CONFIRMATION_MESSAGE)
      .subscribe(confirmResult => {
        if (confirmResult) {
          this.service.deleteAURForm(this.aurFormObj.formId).subscribe(() => {
            this.router.navigate(['forms']);
          });
        }
    });
  }

  print() {
    this.councilDialog.openConfirmDialog(AURFormMessages.PRINT_TITLE, AURFormMessages.PRINT_CONFIRMATION)
      .subscribe(confirmResult => {
        if (confirmResult) {
          window.print();
        }
    });
  }

  hidePrintButton() {
    let result: boolean = true;
    if (window.innerWidth <= 599) {
      result = false;
    }
    return result;
  }

  onFileInput(files, formId) {
    if (!files && !files[0]) {
      return;
    }
    let paymentFile: File = files[0];

    let filesize = ((paymentFile.size/1024)/1024).toFixed(2); // MB
    if (Number.parseFloat(filesize) > 5) {
      this.councilDialog.openDialog(AURFormMessages.UPLOAD_PAYMENT_TITLE, 
        [AURFormMessages.UPLOAD_PAYMENT_FILESIZE_EXCEEDED
          .replace('<filename>', paymentFile.name).replace('<filesize>', filesize)]);
      return;
    }

    this.councilDialog.openConfirmDialog(AURFormMessages.UPLOAD_PAYMENT_TITLE, AURFormMessages.UPLOAD_PAYMENT_CONFIRM
      .replace('<filename>', paymentFile.name).replace('<filesize>', filesize))
      .subscribe(confirmResult => {
        if (confirmResult) { 
          this.service.uploadPaymentProof(paymentFile, formId).subscribe((data) => {
            this.aurFormObj.statusCode = FormStatus.PAID.valueOf();
            this.isPaid = true;
            this.router.navigate(['forms']);
          });
        }
      });
  }

  public back() {
    this.router.navigateByUrl('/forms', {state:{area:this.aurFormObj.area, district:this.aurFormObj.district}});
  }
}
