import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { RosterHeaderLabels } from '../constant/RosterHeaderLabels';

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
    get iSComMembersList() {
        return this._aurForm.get('iSComMembersList') as FormArray;
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
            sectionCode: [null, [Validators.required]],
            dateApplied: [new Date()],
            officialReceiptNo: [null],
            officialReceiptDate: [null],
            expirationDate: [null, [Validators.required]],
            iSComMembersList: this.formBuild.array([]),
            unitMembersList: this.formBuild.array([])
        });
        this.addISComControls();
        this.addUnitMembersControls();
    }

    private addISComControls() {
        let maxUnitMembers = RosterHeaderLabels.iSComPositions.length;
        for(let i=0; i < maxUnitMembers; i++) {
            this.iSComMembersList.push(
                this.formBuild.group({
                    positionCode: [i, [Validators.required]],
                    surname: [null, [Validators.required]],
                    givenName: [null, [Validators.required]],
                    middleInitial: [null, [Validators.required]],
                    signature: [{value: null, disabled: true}, []],
                    age: [null, [Validators.required, Validators.min]],
                    membershipCertNo: [{value: null, disabled: true}, []],
                    highestTraining: [null, [Validators.required]],
                    tenure: [null, [Validators.required]],
                    religion: [null, [Validators.required]]
                })
            );
        }
    }

    private addUnitMembersControls() {
        // Member Positions: 7; Unit Members: 32; Blank Rows: 3;
        let maxUnitMembers = RosterHeaderLabels.memberPositions.length+32+3;
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
                    highestBadge: [null, [Validators.required]],
                    tenure: [null, [Validators.required]],
                    religion: [null, [Validators.required]]
                })
            );
        }
    }

}