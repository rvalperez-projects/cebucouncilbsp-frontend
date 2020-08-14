import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.module';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { FormsListComponent } from './component/forms-list/forms-list.component';
import { FormRegistrationComponent } from './component/form-registration/form-registration.component';
import { UsersListComponent } from './component/users-list/users-list.component';
import { PaymentComponent } from './component/payment/payment.component';
import { LeftMenuComponent } from './component/left-menu/left-menu.component';
import { ErrorDialog } from './component/dialog/error-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    FormsListComponent,
    FormRegistrationComponent,
    UsersListComponent,
    PaymentComponent,
    LeftMenuComponent,
    ErrorDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule, 
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
