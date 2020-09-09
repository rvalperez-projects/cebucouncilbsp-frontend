import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { AURFormMessages } from '../constant/Messages';
import { ResourceURL } from '../constant/ResourceURL';
import { AURFormGroup } from '../formGroups/AURFormGroup';
import { AURFormRegistration, ISComMemberDetails, RegistrationFees, UnitMemberDetails } from '../model/aur-form-registration.model';
import { BaseResponse } from '../model/base-response.model';
import { InstitutionModel } from '../model/entities.model';

@Injectable({
  providedIn: 'root'
})
export class FormRegistrationService {

  constructor(
    private http: HttpClient,
    private councilDialog: CouncilDialog
  ) {}

  public initializeAUR(aurFormObj: AURFormRegistration, aurForm: AURFormGroup) {
    // Initialize AUR Form DTO
    aurFormObj.formId = null;
    aurFormObj.unitNumber = aurForm.unitNumber.value;
    aurFormObj.unitRegistrationNo = null;
    aurFormObj.sectionCode = aurForm.sectionCode.value;
    aurFormObj.statusCode = aurForm.statusCode.value;
    aurFormObj.dateApplied = aurForm.dateApplied.value;
    aurFormObj.expirationDate = aurForm.expirationDate.value;
    aurFormObj.officialReceiptNo = null;
    aurFormObj.officialReceiptDate = null;

    aurFormObj.institutionId = Number.parseInt(aurForm.institutionId.value);
    this.getInstitutionById(aurForm.institutionId.value).subscribe((institution: InstitutionModel) => {
      aurFormObj.institutionName = institution.institutionName;
      aurFormObj.district = institution.district;
    })
    aurFormObj.council = "Cebu Council";
  }

  public populateAurFormObj(aurFormObj: AURFormRegistration, aurForm: AURFormGroup) {
    aurFormObj.iscomMembersList = [];
    aurFormObj.unitMembersList = [];
    
    // Populate ISCom Officers
    for (let member of aurForm.iscomMembersList.value) {
      // Add only when there is value in Surname
      if (member.surname) {
        let iSComMember = new ISComMemberDetails();
        if (member.positionCode > 5) {
          // Asst. Unit Leader
          iSComMember.positionCode = `05`;
        } else {
          // OFFICERS
          iSComMember.positionCode = `0${member.positionCode}`;
        }
        iSComMember.surname = member.surname;
        iSComMember.givenName = member.givenName;
        iSComMember.middleInitial = member.middleInitial;
        iSComMember.signature = member.signature == undefined ? null : member.signature;
        iSComMember.age = member.age;
        iSComMember.membershipCertNo = member.membershipCertNo == undefined ? null : member.membershipCertNo;
        iSComMember.highestTrainingCode = member.highestTrainingCode;
        iSComMember.tenure = member.tenure;
        iSComMember.religion = member.religion;
        aurFormObj.iscomMembersList.push(iSComMember);
      }
    }
    
    // Populate Unit Members
    for (let member of aurForm.unitMembersList.value) {
      // Add only when there is value in Surname
      if (member.surname) {
        let unitMember = new UnitMemberDetails();
        if (member.positionCode > 8) {
          // MEMBERS
          unitMember.positionCode = `09`;
        } else {
          // OFFICERS
          unitMember.positionCode = `0${member.positionCode}`;
        }
        unitMember.surname = member.surname;
        unitMember.givenName = member.givenName;
        unitMember.middleInitial = member.middleInitial;
        unitMember.registrationStatusCode = member.registrationStatusCode;
        unitMember.age = member.age;
        unitMember.membershipCertNo = member.membershipCertNo == undefined ? null : member.membershipCertNo;
        unitMember.highestBadgeCode = member.highestBadgeCode;
        unitMember.tenure = member.tenure;
        unitMember.religion = member.religion;
        aurFormObj.unitMembersList.push(unitMember);
      }
    }

    // Set values that can be changed from Form
    aurFormObj.unitNumber = aurForm.unitNumber.value;
    aurFormObj.sectionCode = aurForm.sectionCode.value;
    aurFormObj.charterFlag = aurForm.charterFlag.value;
  }
  
  public calculateFees(aurFormObj: AURFormRegistration, registrationFee: RegistrationFees) {
    registrationFee.resetCounters();

    // Count number of registrants
    for (let member of aurFormObj.iscomMembersList) {
      switch(member.positionCode) {
        case "00": registrationFee.iSCRepsCount++; break;
        case "01": registrationFee.iSCRepsCount++; break;
        case "02": registrationFee.iSCChairsCount++; break;
        case "03": registrationFee.iSCChairsCount++; break;
        case "04": registrationFee.unitLeadersCount++; break;
        case "05": registrationFee.unitLeadersCount++; break;
      }
    }
    registrationFee.scoutsCount = aurFormObj.unitMembersList.length;

    // Get payable amount
    registrationFee.iSCRepsTotal = registrationFee.iSCRepsCount * 100;
    registrationFee.iSCChairsTotal = registrationFee.iSCChairsCount * 100;
    registrationFee.unitLeadersTotal = registrationFee.unitLeadersCount * 60;
    registrationFee.scoutsTotal = registrationFee.scoutsCount * 50;
    registrationFee.calculateTotalAmount();
  }

  public submitAURForm(aurFormObj: AURFormRegistration): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(ResourceURL.HOST + ResourceURL.FORM_SUBMIT, JSON.stringify(aurFormObj))
      .pipe(
        map(data => {
          return data.result.formId;
        }),
        catchError(error => {
          if (error.status != '500' && error.error) {
            this.councilDialog.openDialog(AURFormMessages.SUBMISSION_FAILED, error.error.errorMessages);
          }
          return throwError(error);
        })
      );
  }

  private getInstitutionById(institutionId: string): Observable<InstitutionModel> {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.INSTITUTION_ID.replace("{institutionId}", institutionId))
        .pipe(
          map(data => {
            let institution = data.result as InstitutionModel;
            return institution;
          }),
          catchError(error => {
            if (error.status != '500' && error.error) {
              this.councilDialog.openDialog(AURFormMessages.SUBMISSION_FAILED, error.error.errorMessages);
            }
            return throwError(error);
          })
        );
  }

  public getInstitutionUnitNumbers(institutionId: string) {
    return this.http.get<BaseResponse>(ResourceURL.HOST + 
      ResourceURL.INSTITUTION_UNIT_NUMBERS.replace("{institutionId}", institutionId))
        .pipe(
          map(data => {
            return data.result;
          }),
          catchError(error => {
            if (error.status != '500' && error.error) {
              this.councilDialog.openDialog(AURFormMessages.SUBMISSION_FAILED, error.error.errorMessages);
            }
            return throwError(error);
          })
        );
  }

}
