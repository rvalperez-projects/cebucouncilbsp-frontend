export class AURFormRegistration {
    formId: number;
    institutionId: number;
    institutionName: string;
    district: string;
    area: string;
    council: string;
    unitNumber: string;
    sectionCode: string;
    dateApplied: Date;
    unitRegistrationNo: string;
    officialReceiptNo: string;
    officialReceiptDate: Date;
    expirationDate: Date;
    iSComMembersList: Array<ISComMemberDetails>;
    unitMembersList: Array<UnitMemberDetails>;

    constructor() {
        this.iSComMembersList = new Array<ISComMemberDetails>();
        this.unitMembersList = new Array<UnitMemberDetails>();
    }
}

export class ISComMemberDetails {
    positionCode:string;
    surname:string;
    givenName:string
    middleInitial:string;
    signature:string;
    age:number;
    membershipCertNo:string;
    highestTraining:string;
    tenure:number;
    religion:string;
}

export class UnitMemberDetails {
    positionCode:string;
    surname:string;
    givenName:string
    middleInitial:string;
    registrationStatusCode:string;
    age:number;
    membershipCertNo:string;
    highestBadge:string;
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