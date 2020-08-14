import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'error-dialog.component',
    templateUrl: 'error-dialog.component.html',
})
export class ErrorDialog {
    constructor(
        public dialogRef: MatDialogRef<ErrorDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    close() {
        this.dialogRef.close();
    }
}