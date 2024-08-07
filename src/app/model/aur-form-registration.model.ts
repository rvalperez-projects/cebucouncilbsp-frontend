import { BaseModel } from '../model/entities.model';

export class AURFormRegistration extends BaseModel {
    formId: number;
    institutionId: number;
    institutionName: string;
    institutionCategory: string;
    district: string;
    area: string;
    council: string;
    unitNumber: string;
    charterFlag: boolean;
    sectionCode: string;
    dateApplied: Date;
    unitRegistrationNo: string;
    officialReceiptNo: string;
    officialReceiptDate: Date;
    expirationDate: Date;
    statusCode: string;
    councilRegistrationOfficer: string;
    councilProcessedDate: Date;
    councilScoutExecutive: string;
    councilApprovedDate: Date;
    regionalRegistrationOfficer: string;
    regionalProcessedDate: Date;
    regionalScoutExecutive: string;
    regionalApprovedDate: Date;
    iscomMembersList: Array<ISComMemberDetails>;
    unitMembersList: Array<UnitMemberDetails>;

    constructor() {
        super();
        this.iscomMembersList = new Array<ISComMemberDetails>();
        this.unitMembersList = new Array<UnitMemberDetails>();
    }
}

export class ISComMemberDetails extends BaseModel {
    iscomId:number;
    formId:number;
    positionCode:string;
    surname:string;
    givenName:string
    middleInitial:string;
    signature:string;
    age:number;
    membershipCertNo:string;
    highestTrainingCode:string;
    tenure:number;
    religion:string;
}

export class UnitMemberDetails extends BaseModel {
    memberId:number;
    formId:number;
    positionCode:string;
    surname:string;
    givenName:string
    middleInitial:string;
    registrationStatusCode:string;
    age:number;
    membershipCertNo:string;
    highestBadgeCode:string;
    tenure:number;
    religion:string;
}

export class RegistrationFees {
  iSCRepsCount: number = 0;
  iSCChairsCount: number = 0;
  unitLeadersCount: number = 0;
  scoutsCount: number = 0;
  iSCCharterFee: number = 0;

  iSCRepsTotal: number = 0;
  iSCChairsTotal: number = 0;
  unitLeadersTotal: number = 0;
  scoutsTotal: number = 0;
  iSCCharterFeeTotal: number = 0;

  totalAmount: number = 0;

  public calculateTotalAmount() {
      this.totalAmount = this.iSCRepsTotal + this.iSCChairsTotal 
        + this.unitLeadersTotal + this.scoutsTotal + this.iSCCharterFeeTotal;
  }

  public resetCounters() {
    this.iSCRepsCount = 0;
    this.iSCChairsCount = 0;
    this.unitLeadersCount = 0;
    this.scoutsCount = 0;
  }
}