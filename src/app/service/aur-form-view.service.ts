import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { AURFormMessages } from '../constant/Messages';
import { ResourceURL } from '../constant/ResourceURL';
import { RosterHeaderLabels } from '../constant/RosterHeaderLabels';
import { AURFormRegistration, ISComMemberDetails, RegistrationFees, UnitMemberDetails } from '../model/aur-form-registration.model';
import { BaseResponse } from '../model/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class AURFormViewService {

  private formId: number;

  constructor(
    private http: HttpClient,
    private councilDialog: CouncilDialog
    ) { 
    
  }

  public initializeAUR(aurFormObj: AURFormRegistration, registrationFee: RegistrationFees) {

    return this.retrieveAURFormDetails(aurFormObj.formId).pipe(
      map(data => {
        let result = data.result as AURFormRegistration;

        // Initialize AUR Form DTO
        aurFormObj.institutionId = result.institutionId;
        aurFormObj.unitNumber = result.unitNumber;
        aurFormObj.unitRegistrationNo = result.unitRegistrationNo;
        aurFormObj.sectionCode = result.sectionCode;
        aurFormObj.dateApplied = result.dateApplied;
        aurFormObj.officialReceiptNo = result.officialReceiptNo;
        aurFormObj.officialReceiptDate = result.officialReceiptDate;

        aurFormObj.institutionName = result.institutionName;
        aurFormObj.district = result.district;
        aurFormObj.council = "Cebu Council";

        aurFormObj.expirationDate = result.expirationDate;
        aurFormObj.charterFlag = result.charterFlag;
        aurFormObj.statusCode = result.statusCode;

        this.populateAurFormObj(aurFormObj, result);
        this.calculateFees(aurFormObj, registrationFee);
      })
    );
  }

  public populateAurFormObj(aurFormObj: AURFormRegistration, data: AURFormRegistration) {
    aurFormObj.iscomMembersList = [];
    aurFormObj.unitMembersList = [];
    
    // Populate ISCom Officers
    let maxUnitMembers = RosterHeaderLabels.iSComPositions.length;
    let positionCodes = this.getAllPositionCodes(data.iscomMembersList);
    for(let i=0, dataCount=0; i < maxUnitMembers; i++) {
      let member = data.iscomMembersList[dataCount];
      if (member && positionCodes.includes(RosterHeaderLabels.iSComPositions[i].code)) {
        aurFormObj.iscomMembersList.push(member);
        dataCount++;
        continue;
      }
      aurFormObj.iscomMembersList.push(new ISComMemberDetails());
    }
    
    // Populate Unit Members
    // Member Positions: 7; Unit Members: 32; Blank Rows: 3;
    maxUnitMembers = RosterHeaderLabels.memberPositions.length;
    positionCodes = this.getAllPositionCodes(data.unitMembersList);
    for(let i=0, dataCount=0; i < maxUnitMembers; i++) {
      let member = data.unitMembersList[dataCount];
      if (member && positionCodes.includes(RosterHeaderLabels.memberPositions[i].code)) {
        aurFormObj.unitMembersList.push(member);
        dataCount++;
        continue;
      }
      aurFormObj.unitMembersList.push(new UnitMemberDetails());
    }
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
    for (let member of aurFormObj.unitMembersList) {
      if (member && member.surname) {
        registrationFee.scoutsCount++;
      }
    }

    // Get payable amount
    registrationFee.iSCRepsTotal = registrationFee.iSCRepsCount * 100;
    registrationFee.iSCChairsTotal = registrationFee.iSCChairsCount * 100;
    registrationFee.unitLeadersTotal = registrationFee.unitLeadersCount * 60;
    registrationFee.scoutsTotal = registrationFee.scoutsCount * 50;
    registrationFee.iSCCharterFeeTotal = (aurFormObj.charterFlag == true ? 1 : 0) * 10;
    registrationFee.calculateTotalAmount();
  }

  private retrieveAURFormDetails(formId: number) : Observable<BaseResponse>{

     return this.http.get<BaseResponse>(ResourceURL.HOST + 
        ResourceURL.FORM_DISPLAY.replace("{formId}", formId.toString()))
        .pipe(
          map(data => data),
          catchError(error => {
            if (error.status != '500' && error.error) {
              this.councilDialog.openDialog(AURFormMessages.RETRIEVAL_FAILED, error.error.errorMessages);
            }
            return throwError(error);
          })
        );
  }

  public deleteAURForm(formId: number) : Observable<BaseResponse>{

     return this.http.delete<BaseResponse>(ResourceURL.HOST + 
        ResourceURL.FORM_DELETE.replace("{formId}", formId.toString()))
        .pipe(
          map(data => {
            this.councilDialog.openDialog(AURFormMessages.DELETION_SUCCESSFUL, [AURFormMessages.DELETION_SUCCESSFUL_MESSAGE]);
            return data;
          }),
          catchError(error => {
            if (error.status != '500' && error.error) {
              this.councilDialog.openDialog(AURFormMessages.DELETION_FAILED, error.error.errorMessages);
            }
            return throwError(error);
          })
        );
  }

  private getAllPositionCodes(list: Iterable<any>) {
    let result = [];
    for (let item of list) {
      result.push(item.positionCode);
    }
    return result;
  }

}
