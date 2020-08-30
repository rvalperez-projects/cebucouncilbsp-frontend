import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material.module';

// Common Components
import { LoginComponent } from './component/common-components/login/login.component';
import { PaymentComponent } from './component/common-components/payment/payment.component';
import { ErrorDialog } from './component/common-components/dialog/error-dialog.component';
import { HomeComponent } from './component/common-components/home/home.component';

// User Components
import { ProfileComponent } from './component/user/profile/profile.component';
import { UsersListComponent } from './component/user/users-list/users-list.component';
import { SignUpComponent } from './component/user/sign-up/sign-up.component';

// Forms AUR
import { FormsListComponent } from './component/forms-aur/forms-list/forms-list.component';
import { FormRegistrationComponent } from './component/forms-aur/form-registration/form-registration.component';
import { AurFormViewComponent } from './component/forms-aur/aur-form-view/aur-form-view.component';
import { AurFormUpdateComponent } from './component/forms-aur/aur-form-update/aur-form-update.component';

// Utils Components
import { MatSpinnerOverlayComponent } from './utils/mat-spinner-overlay/mat-spinner-overlay.component';
import { HttpErrorInterceptor } from './utils/http-interceptor.utils';


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
