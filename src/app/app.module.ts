import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorDialog } from './component/common-components/dialog/error-dialog.component';
import { HomeComponent } from './component/common-components/home/home.component';
// Common Components
import { LoginComponent } from './component/common-components/login/login.component';
import { PaymentComponent } from './component/common-components/payment/payment.component';
import { AurFormUpdateComponent } from './component/forms-aur/aur-form-update/aur-form-update.component';
import { AurFormViewComponent } from './component/forms-aur/aur-form-view/aur-form-view.component';
import { FormRegistrationComponent } from './component/forms-aur/form-registration/form-registration.component';
// Forms AUR
import { FormsListComponent } from './component/forms-aur/forms-list/forms-list.component';
// User Components
import { ProfileComponent } from './component/user/profile/profile.component';
import { SignUpComponent } from './component/user/sign-up/sign-up.component';
import { UsersListComponent } from './component/user/users-list/users-list.component';
import { HttpErrorInterceptor } from './utils/http-interceptor.utils';
// Utils Components
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
    HomeComponent
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
    MatDialogModule
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
