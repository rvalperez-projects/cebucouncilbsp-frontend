import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SessionConstant } from '../constant/Constants';
import { FormStatus } from '../constant/Enums';
import { RosterHeaderLabels } from '../constant/RosterHeaderLabels';
import { whitespaceOnlyNotAllowed } from '../utils/custom-validators.utils';

@Injectable({
    providedIn: 'root'
})
export class AURFormGroup {

    private _aurForm: FormGroup;

    get form(): FormGroup {
        return this._aurForm;
    }
    get formId() {
        return this._aurForm.get('formId') as FormControl;
    }
    get institutionId() {
        return this._aurForm.get('institutionId') as FormControl;
    }
    get charterFlag() {
        return this._aurForm.get('charterFlag') as FormControl;
    }
    get statusCode() {
        return this._aurForm.get('statusCode') as FormControl;
    }
    get unitNumber() {
        return this._aurForm.get('unitNumber') as FormControl;
    }
    get unitRegistrationNo() {
        return this._aurForm.get('unitRegistrationNo') as FormControl;
    }
    get sectionCode() {
        return this._aurForm.get('sectionCode') as FormControl;
    }
    get dateApplied() {
        return this._aurForm.get('dateApplied') as FormControl;
    }
    get expirationDate() {
        return this._aurForm.get('expirationDate') as FormControl;
    }
    get officialReceiptNo() {
        return this._aurForm.get('officialReceiptNo') as FormControl;
    }
    get officialReceiptDate() {
        return this._aurForm.get('officialReceiptDate') as FormControl;
    }
    get iscomMembersList() {
        return this._aurForm.get('iscomMembersList') as FormArray;
    }
    get unitMembersList() {
        return this._aurForm.get('unitMembersList') as FormArray;
    }

    constructor(private formBuild: FormBuilder) {
        this.createForm();
    }

    private createForm() {
        let institutionId = window.sessionStorage.getItem(SessionConstant.USER_INSTITUTION_ID_KEY); 
        let now = new Date();
        this._aurForm = this.formBuild.group({
            formId: [null],
            institutionId: [institutionId, [Validators.required]],
            unitRegistrationNo: [null, [whitespaceOnlyNotAllowed]],
            unitNumber: [null, [Validators.required]],
            charterFlag: [false, [Validators.required]],
            sectionCode: [null, [Validators.required]],
            statusCode: [FormStatus.SUBMITTED],
            dateApplied: [now, [Validators.required]],
            officialReceiptNo: [null, [whitespaceOnlyNotAllowed]],
            officialReceiptDate: [null],
            expirationDate: [null, [Validators.required]],
            iscomMembersList: this.formBuild.array([]),
            unitMembersList: this.formBuild.array([])
        });
        this.addISComControls();
        this.addUnitMembersControls();
    }

    private addISComControls() {
        let maxUnitMembers = RosterHeaderLabels.iSComPositions.length;
        for(let i=0; i < maxUnitMembers; i++) {
            this.iscomMembersList.push(
                this.formBuild.group({
                    iSComId: [null],
                    formId: [null],
                    positionCode: [i, [Validators.required]],
                    surname: [null, [Validators.required, whitespaceOnlyNotAllowed]],
                    givenName: [null, [Validators.required, whitespaceOnlyNotAllowed]],
                    middleInitial: [null, [whitespaceOnlyNotAllowed]],
                    signature: [{value: null, disabled: true}, []],
                    age: [null, [Validators.required, Validators.min(18)]],
                    membershipCertNo: [{value: null, disabled: true}, [whitespaceOnlyNotAllowed]],
                    highestTrainingCode: [null],
                    tenure: [null, []],
                    religion: [null]
                })
            );
        }
    }

    private addUnitMembersControls() {
        // Member Positions: 7; Unit Members: 32; Blank Rows: 3;
        let maxUnitMembers = RosterHeaderLabels.memberPositions.length;
        for(let i=0; i < maxUnitMembers; i++) {
            this.unitMembersList.push(
                this.formBuild.group({
                    memberId: [null],
                    formId: [null],
                    positionCode: [i, [Validators.required]],
                    surname: [null, [Validators.required, whitespaceOnlyNotAllowed]],
                    givenName: [null, [Validators.required, whitespaceOnlyNotAllowed]],
                    middleInitial: [null, [whitespaceOnlyNotAllowed]],
                    registrationStatusCode: [null, [Validators.required]],
                    age: [null, [Validators.required]],
                    membershipCertNo: [{value: null, disabled: true}, [whitespaceOnlyNotAllowed]],
                    highestBadgeCode: [null],
                    tenure: [null, []],
                    religion: [null]
                })
            );
        }
    }

    checkInputData(errorMessages: Array<string>) {

        // Get ISCom Members Errors
        for (let formGroup in this.iscomMembersList.value) {
            let missingFields: Array<string> = new Array<string>();
            let surname = this.iscomMembersList.controls[formGroup].controls['surname'].value;
            if (!surname) {
                continue;
            }
            for (let property in this.iscomMembersList.controls[formGroup].controls) {
                let controlErrors: ValidationErrors = this.iscomMembersList.controls[formGroup].controls[property].errors;
                if (controlErrors != null) {
                    for (let error in controlErrors) {
                        // All Validators are Required only.
                        let errorMessage = "Sctr. " + surname + "'s " + property + " is required.";
                        console.info(errorMessage);
                        missingFields.push(property);
                    }
                }
            }
            if (missingFields.length > 0) {
                errorMessages.push("Sctr. " + surname + ":\n[" + missingFields.join(", ") + "]");
            }
        }

        // Get Unit Members Errors
        for (let formGroup in this.unitMembersList.value) {
            let missingFields: Array<string> = new Array<string>();
            let surname = this.unitMembersList.controls[formGroup].controls['surname'].value;
            if (!surname) {
                continue;
            }
            for (let property in this.unitMembersList.controls[formGroup].controls) {
                let controlErrors: ValidationErrors = this.unitMembersList.controls[formGroup].controls[property].errors;
                if (controlErrors != null) {
                    for (let error in controlErrors) {
                        // All Validators are Required only.
                        let errorMessage = "Sctr. " + surname + "'s " + property + " is required.";
                        console.info(errorMessage);
                        missingFields.push(property);
                    }
                }
            }
            if (missingFields.length > 0) {
                errorMessages.push("Sctr. " + surname + ":\n[" + missingFields.join(", ") + "]");
            }
        }
        
        let missingFields = new Array<string>();
        for (let item in this._aurForm.controls) {
            let controlErrors: ValidationErrors = this._aurForm.controls[item].errors;
            if (!controlErrors) {
                continue;
            }
            for (let error in controlErrors) {
                // All Validators are Required only.
                missingFields.push(item);
            }
        }
        if (missingFields.length > 0) {
            errorMessages.push("Missing required fields:\n[" + missingFields.join(", ") + "]");
        }
    }

}