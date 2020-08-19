import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
    get institution() {
        return this._aurFormListForm.get('institution') as FormControl;
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
            institution: [null],
            name: ['']
        });
    }

}

