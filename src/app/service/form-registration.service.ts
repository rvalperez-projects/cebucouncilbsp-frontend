import { Injectable } from '@angular/core';
import { AURFormGroup } from '../formGroups/AURFormGroup';
import { AURFormRegistration, ISComMemberDetails, UnitMemberDetails, RegistrationFees } from '../model/AURFormRegistration';

@Injectable({
  providedIn: 'root'
})
export class FormRegistrationService {

  constructor() { 
    
  }

  public initializeAUR(aurFormObj: AURFormRegistration, aurForm: AURFormGroup) {
    // Initialize AUR Form DTO
    aurFormObj.formId = null;
    aurFormObj.institutionId = 0;
    aurFormObj.unitNumber = aurForm.unitNumber.value;
    aurFormObj.unitRegistrationNo = null;
    aurFormObj.sectionCode = aurForm.sectionCode.value;
    aurFormObj.dateApplied = aurForm.dateApplied.value;
    aurFormObj.officialReceiptNo = null;
    aurFormObj.officialReceiptDate = null;

    aurFormObj.institutionName = "School Name";
    aurFormObj.district = "North 1";
    aurFormObj.council = "Cebu Council";

    aurFormObj.unitNumber = aurForm.unitNumber.value;
    aurFormObj.sectionCode = aurForm.sectionCode.value;
    aurFormObj.dateApplied = aurForm.dateApplied.value;

    let expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1)
    aurFormObj.expirationDate = expirationDate;
  }

  public populateAurFormObj(aurFormObj: AURFormRegistration, aurForm: AURFormGroup) {
    aurFormObj.iSComMembersList = [];
    aurFormObj.unitMembersList = [];
    
    // Set values that can be changed from Form
    aurFormObj.unitNumber = aurForm.unitNumber.value;
    aurFormObj.sectionCode = aurForm.sectionCode.value;
    
    // Populate ISCom Officers
    for (let member of aurForm.iSComMembersList.value) {
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
        iSComMember.highestTraining = member.highestTraining;
        iSComMember.tenure = member.tenure;
        iSComMember.religion = member.religion;
        aurFormObj.iSComMembersList.push(iSComMember);
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
        unitMember.highestBadge = member.highestBadge;
        unitMember.tenure = member.tenure;
        unitMember.religion = member.religion;
        aurFormObj.unitMembersList.push(unitMember);
      }
    }
    console.log(aurFormObj.iSComMembersList);
    console.log(aurFormObj.unitMembersList);
  }
  
  public calculateFees(aurFormObj: AURFormRegistration, registrationFee: RegistrationFees) {
    registrationFee.resetCounters();

    // Count number of registrants
    for (let member of aurFormObj.iSComMembersList) {
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

}