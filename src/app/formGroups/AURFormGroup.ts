import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { RosterHeaderLabels } from '../constant/RosterHeaderLabels';
import { AURFormErrorMessages } from '../constant/Messages';

@Injectable({
    providedIn: 'root'
})
export class AURFormGroup {

    private _aurForm: FormGroup;

    get form(): FormGroup {
        return this._aurForm;
    }
    get unitNumber() {
        return this._aurForm.get('unitNumber') as FormControl;
    }
    get sectionCode() {
        return this._aurForm.get('sectionCode') as FormControl;
    }
    get dateApplied() {
        return this._aurForm.get('dateApplied') as FormControl;
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
        this._aurForm = this.formBuild.group({
            formId: [null, [Validators.required]],
            institutionId: [null, [Validators.required]],
            unitRegistrationNo: [null, [Validators.required]],
            unitNumber: [null, [Validators.required]],
            charterFlag: [false],
            sectionCode: [null, [Validators.required]],
            dateApplied: [new Date()],
            officialReceiptNo: [null],
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
                    positionCode: [i, [Validators.required]],
                    surname: [null, [Validators.required]],
                    givenName: [null, [Validators.required]],
                    middleInitial: [null, [Validators.required]],
                    signature: [{value: null, disabled: true}, []],
                    age: [null, [Validators.required]],
                    membershipCertNo: [{value: null, disabled: true}, []],
                    highestTraining: [null],
                    tenure: [null, [Validators.required]],
                    religion: [null, [Validators.required]]
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
                    positionCode: [i, [Validators.required]],
                    surname: [null, [Validators.required]],
                    givenName: [null, [Validators.required]],
                    middleInitial: [null, [Validators.required]],
                    registrationStatusCode: [null, [Validators.required]],
                    age: [null, [Validators.required]],
                    membershipCertNo: [{value: null, disabled: true}, []],
                    highestBadge: [null],
                    tenure: [null, [Validators.required]],
                    religion: [null, [Validators.required]]
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

        // Check Unit Number and Section Code
        if (!this.unitNumber.value) {
            errorMessages.push(AURFormErrorMessages.UNIT_NUMBER_NOT_SET);
        }
        if (!this.sectionCode.value) {
            errorMessages.push(AURFormErrorMessages.SECTION_CODE_NOT_SET);
        }
    }

}