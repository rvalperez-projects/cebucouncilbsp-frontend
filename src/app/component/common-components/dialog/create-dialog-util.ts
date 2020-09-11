import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewUnitNumberComponent } from '../../master/unit-number/new-unit-number/new-unit-number.component';
import { ConfirmDialog } from './confirm-dialog.component';
import { ErrorDialog } from './error-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class CouncilDialog {

    constructor(private dialog: MatDialog) {
    }

    public openDialog(title: string, errorMessages: Array<string>) {
        const dialogRef = this.dialog.open(ErrorDialog, {
            width: "500px",
            role: "alertdialog",
            data: {
                title: title,
                errorMessages: errorMessages
            }
        });

        // Print Dialog result on close
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(`Dialog result: ${result}`);
            }
        });
    }

    public openConfirmDialog(title: string, message: string) {
        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: "500px",
            role: "dialog",
            data: {
                title: title,
                message: message
            }
        });

        // Return Observable
        return dialogRef.afterClosed();
    }

    public createNewUnitNumber() {
        const dialogRef = this.dialog.open(NewUnitNumberComponent, {
            width: "500px", role: "dialog"
        });
  
        // Call Service when there is an input
        return dialogRef.afterClosed();
    }
}