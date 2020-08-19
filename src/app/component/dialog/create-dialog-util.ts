import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
}