import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { FormsListComponent } from './component/forms-list/forms-list.component';
import { FormRegistrationComponent } from './component/form-registration/form-registration.component';
import { UsersListComponent } from './component/users-list/users-list.component';
import { PaymentComponent } from './component/payment/payment.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: FormsListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'forms', component: FormsListComponent,
    children: [
      { path: 'new', component: FormRegistrationComponent }
    ]
  },
  { path: 'users', component: UsersListComponent },
  { path: 'payment', component: PaymentComponent }
  //,{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
