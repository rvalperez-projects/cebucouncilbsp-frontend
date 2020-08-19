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
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { FormsListComponent } from './component/forms-list/forms-list.component';
import { FormRegistrationComponent } from './component/form-registration/form-registration.component';
import { UsersListComponent } from './component/users-list/users-list.component';
import { PaymentComponent } from './component/payment/payment.component';
import { LeftMenuComponent } from './component/left-menu/left-menu.component';
import { ErrorDialog } from './component/dialog/error-dialog.component';
import { HttpErrorInterceptor } from './utils/http-interceptor.utils';
import { AurFormViewComponent } from './component/aur-form-view/aur-form-view.component';

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
    ErrorDialog,
    AurFormViewComponent
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
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
