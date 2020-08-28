import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, Validators, FormControl} from '@angular/forms';
import { RosterHeaderLabels } from '../../constant/RosterHeaderLabels';
import { AURFormRegistration, RegistrationFees } from '../../model/aur-form-registration.model';
import { AURFormUpdateService } from '../../service/aur-form-update.service';
import { AURFormGroup } from '../../formGroups/AURFormGroup';
import { CouncilDialog } from '../dialog/create-dialog-util';
import { AURFormMessages } from '../../constant/Messages';
import { FormStatus } from '../../constant/Enums';
import { ResourceURL } from 'src/app/constant/ResourceURL';

@Component({
  selector: 'app-aur-form-update',
  templateUrl: './aur-form-update.component.html',
  styleUrls: ['./aur-form-update.component.css']
})
export class AurFormUpdateComponent implements OnInit {

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
  
  // Error Messages
  errorMessages: Array<string>;

  constructor(
    private route: ActivatedRoute,
    public  router: Router,
    private service : AURFormUpdateService,
    private councilDialog: CouncilDialog, 
    public aubFormGroup: AURFormGroup ) {

    this.aurFormObj = new AURFormRegistration();
    this.registrationFee = new RegistrationFees();
    this.errorMessages = new Array<string>();
  }

  ngOnInit(): void {
    this.loading = true;
    this.aurFormObj.formId = Number.parseInt(this.route.snapshot.paramMap.get("id"));
    this.service.initializeAUR(this.aurFormObj, this.registrationFee).subscribe(() => {
      this.loading = false;
      this.enableMembershipCertNo();
      this.aubFormGroup.formId.setValue(this.aurFormObj.formId);
      this.aubFormGroup.unitNumber.setValue(this.aurFormObj.unitNumber);
      this.aubFormGroup.sectionCode.setValue(this.aurFormObj.sectionCode);
      this.aubFormGroup.officialReceiptNo.setValue(this.aurFormObj.officialReceiptNo);
      this.aubFormGroup.officialReceiptDate.setValue(this.aurFormObj.officialReceiptDate);
      this.aubFormGroup.unitRegistrationNo.setValue(this.aurFormObj.unitRegistrationNo);
    });

    // Set required fields
    this.aubFormGroup.officialReceiptNo.setValidators(Validators.required);
    this.aubFormGroup.officialReceiptDate.setValidators(Validators.required);
    this.aubFormGroup.unitRegistrationNo.setValidators(Validators.required);
  }
  /**
   * Submit the AUR Form for update of required fields.
   */
  public processAURForm() {
    // Check required input fields
    this.setRequiredInfo();
    if (!this.hasErrors()) {
      this.aurFormObj.statusCode = FormStatus.PROCESSED;
      this.service.updateAURForm(this.aurFormObj).subscribe(() => {
        this.councilDialog.openDialog(AURFormMessages.PROCESSING_SUCCESSFUL_TITLE, [AURFormMessages.PROCESSING_SUCCESSFUL_TEXT]);

        // Route to AUR Form View
        this.router.navigateByUrl('/forms/' + this.aurFormObj.formId);
      });
    }
  }

  /**
   * Retrieves the first inputted Membership Cert. No. from the ISCom List and Members List,
   * and auto-populates succeeding text boxes incrementally.
   */
  public populateMembershipCertNo() {
    let firstCertNo = null;
    for (let i=0; i<this.iSComPositions.length; i++) {
      let memberFormGroup = this.aubFormGroup.iscomMembersList.controls[i] as FormGroup;
      let membershipCertNo = memberFormGroup.controls['membershipCertNo'] as FormControl;
      if (this.aurFormObj.iscomMembersList[i].iscomId) {
        if (!firstCertNo) {
          firstCertNo = membershipCertNo.value;
        }
        this.aurFormObj.iscomMembersList[i].membershipCertNo = (firstCertNo == null) ? null : firstCertNo.toString();
        membershipCertNo.setValue(firstCertNo++);
        membershipCertNo.markAsDirty();
      }
    }

    firstCertNo = null;
    for (let i=0; i<this.memberPositions.length; i++) {
      let memberFormGroup = this.aubFormGroup.unitMembersList.controls[i] as FormGroup;
      let membershipCertNo = memberFormGroup.controls['membershipCertNo'] as FormControl;
      if (this.aurFormObj.unitMembersList[i].memberId) {
        if (!firstCertNo) {
          firstCertNo = membershipCertNo.value;
        }
        this.aurFormObj.unitMembersList[i].membershipCertNo = (firstCertNo == null) ? null : firstCertNo.toString();
        membershipCertNo.setValue(firstCertNo++);
        membershipCertNo.markAsDirty();
      }
    }
  }

  /**
   * Enable Membership Cert. No. input fields when there is a registered data for that row.
   */
  private enableMembershipCertNo() {
    for (let i=0; i<this.iSComPositions.length; i++) {
      let memberFormGroup = this.aubFormGroup.iscomMembersList.controls[i] as FormGroup;
      if (this.aurFormObj.iscomMembersList[i].iscomId) {
        let membershipCertNo = memberFormGroup.controls['membershipCertNo'] as FormControl;
        membershipCertNo.enable();
        membershipCertNo.setValidators(Validators.required);
        membershipCertNo.setValue(this.aurFormObj.iscomMembersList[i].membershipCertNo);
      }
    }
    for (let i=0; i<this.memberPositions.length; i++) {
      let memberFormGroup = this.aubFormGroup.unitMembersList.controls[i] as FormGroup;
      if (this.aurFormObj.unitMembersList[i].memberId) {
        let membershipCertNo = memberFormGroup.controls['membershipCertNo'] as FormControl;
        membershipCertNo.enable();
        membershipCertNo.setValidators(Validators.required);
        membershipCertNo.setValue(this.aurFormObj.unitMembersList[i].membershipCertNo);
      }
    }
  }

  private setRequiredInfo() {
    this.errorMessages = [];

    // Set Form Fields
    if (this.aubFormGroup.officialReceiptNo.value) {
      this.aurFormObj.officialReceiptNo = this.aubFormGroup.officialReceiptNo.value;
    } else {
      this.errorMessages.push(AURFormMessages.OFFICIAL_RECEIPT_NO_BLANK);
    }
    if (this.aubFormGroup.officialReceiptDate.value) {
      if (new Date(this.aubFormGroup.officialReceiptDate.value) > new Date()) {
        this.errorMessages.push(AURFormMessages.OFFICIAL_RECEIPT_DATE_FUTURE);
      } else {
        this.aurFormObj.officialReceiptDate = this.aubFormGroup.officialReceiptDate.value;
      }
    } else {
      this.errorMessages.push(AURFormMessages.OFFICIAL_RECEIPT_DATE_BLANK);
    }
    if (this.aubFormGroup.unitRegistrationNo.value) {
      this.aurFormObj.unitRegistrationNo = this.aubFormGroup.unitRegistrationNo.value;
    } else {
      this.errorMessages.push(AURFormMessages.UNIT_REGISTRATION_NO_BLANK);
    }

    // Set Membership Cert. Nos.
    for (let i=0; i<this.iSComPositions.length; i++) {
      let memberFormGroup = this.aubFormGroup.iscomMembersList.controls[i] as FormGroup;
      let membershipCertNo = memberFormGroup.controls['membershipCertNo'] as FormControl;
      if (this.aurFormObj.iscomMembersList[i].iscomId && !membershipCertNo.value) {
        this.errorMessages.push("Sctr. " + this.aurFormObj.iscomMembersList[i].surname + 
          AURFormMessages.MISSING_MEMBERSHIP_CERT_NO);
        continue;
      }
      this.aurFormObj.iscomMembersList[i].membershipCertNo = membershipCertNo.value;
    }
    for (let i=0; i<this.memberPositions.length; i++) {
      let memberFormGroup = this.aubFormGroup.unitMembersList.controls[i] as FormGroup;
      let membershipCertNo = memberFormGroup.controls['membershipCertNo'] as FormControl;
      if (this.aurFormObj.unitMembersList[i].memberId && !membershipCertNo.value) {
        this.errorMessages.push("Sct. " + this.aurFormObj.unitMembersList[i].surname + 
          AURFormMessages.MISSING_MEMBERSHIP_CERT_NO);
        continue;
      }
      this.aurFormObj.unitMembersList[i].membershipCertNo = membershipCertNo.value;
    }
  }

  private hasErrors(): boolean {    
    if (this.errorMessages.length > 0) {      
      this.councilDialog.openDialog(AURFormMessages.SUBMISSION_ERROR, this.errorMessages);
      return true;
    }
    return false;
  }
}
