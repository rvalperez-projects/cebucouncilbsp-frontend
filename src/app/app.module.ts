import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmDialog } from './component/common-components/dialog/confirm-dialog.component';
import { ErrorDialog } from './component/common-components/dialog/error-dialog.component';
import { FooterComponent } from './component/common-components/footer/footer.component';
import { HomeComponent } from './component/common-components/home/home.component';
import { LoginComponent } from './component/common-components/login/login.component';
import { PaymentComponent } from './component/common-components/payment/payment.component';
import { AurFormUpdateComponent } from './component/forms-aur/aur-form-update/aur-form-update.component';
import { AurFormViewComponent } from './component/forms-aur/aur-form-view/aur-form-view.component';
import { FormRegistrationComponent } from './component/forms-aur/form-registration/form-registration.component';
import { InputUnitNumberComponent } from './component/forms-aur/form-registration/input-unit-number/input-unit-number.component';
import { FormsListComponent } from './component/forms-aur/forms-list/forms-list.component';
import { NewUnitNumberComponent } from './component/master/unit-number/new-unit-number/new-unit-number.component';
import { UnitNumberComponent } from './component/master/unit-number/unit-number.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { SignUpComponent } from './component/user/sign-up/sign-up.component';
import { UsersListComponent } from './component/user/users-list/users-list.component';
import { HttpErrorInterceptor } from './utils/http-interceptor.utils';
import { MatSpinnerOverlayComponent } from './utils/mat-spinner-overlay/mat-spinner-overlay.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    FormsListComponent,
    FormRegistrationComponent,
    UsersListComponent,
    PaymentComponent,
    ErrorDialog,
    AurFormViewComponent,
    AurFormUpdateComponent,
    MatSpinnerOverlayComponent,
    SignUpComponent,
    HomeComponent,
    FooterComponent,
    ConfirmDialog,
    UnitNumberComponent,
    NewUnitNumberComponent,
    InputUnitNumberComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule, 
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    MatSpinnerOverlayComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
