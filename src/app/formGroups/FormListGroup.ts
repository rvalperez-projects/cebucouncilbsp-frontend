import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class AURFormListFormGroup {

    private _aurFormListForm: FormGroup;

    get form(): FormGroup {
        return this._aurFormListForm;
    }
    get area() {
        return this._aurFormListForm.get('area') as FormControl;
    }
    get district() {
        return this._aurFormListForm.get('district') as FormControl;
    }
    get institutionId() {
        return this._aurFormListForm.get('institutionId') as FormControl;
    }
    get name() {
        return this._aurFormListForm.get('name') as FormControl;
    }
    
    constructor(private formBuild: FormBuilder) {
        this.createForm();
    }
    private createForm() {
        this._aurFormListForm = this.formBuild.group({
            area: [null],
            district: [null],
            institutionId: [null],
            name: ['']
        });
    }

}

