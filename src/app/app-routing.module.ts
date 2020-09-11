import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/common-components/home/home.component';
import { LoginComponent } from './component/common-components/login/login.component';
import { PaymentComponent } from './component/common-components/payment/payment.component';
import { AurFormUpdateComponent } from './component/forms-aur/aur-form-update/aur-form-update.component';
import { AurFormViewComponent } from './component/forms-aur/aur-form-view/aur-form-view.component';
import { FormRegistrationComponent } from './component/forms-aur/form-registration/form-registration.component';
import { FormsListComponent } from './component/forms-aur/forms-list/forms-list.component';
import { UnitNumberComponent } from './component/master/unit-number/unit-number.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { UsersListComponent } from './component/user/users-list/users-list.component';
import { Roles } from './constant/Enums';
import { AuthorizeGuard, LoginGuard } from './utils/auth-guard.utils';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: 'login' 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [LoginGuard] 
  },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthorizeGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent
  },
  { 
    path: 'forms', 
    component: FormsListComponent, 
    canActivate: [AuthorizeGuard],
  },
  { 
    path: 'forms/new', 
    component: FormRegistrationComponent, 
    canActivate: [AuthorizeGuard],
    data: { 
      roles : [Roles.GENERAL_USER] 
    }
  },
  { 
    path: 'forms/view', 
    component: AurFormViewComponent, 
    canActivate: [AuthorizeGuard] 
  },
  { 
    path: 'forms/update', 
    component: AurFormUpdateComponent, 
    canActivate: [AuthorizeGuard],
    data: { 
      roles : [Roles.COUNCIL, Roles.ADMIN] 
    } 
  },
  { 
    path: 
    'users', 
    component: UsersListComponent, 
    canActivate: [AuthorizeGuard],
    data: { 
      roles : [Roles.COUNCIL, Roles.ADMIN] 
    } 
  },
  { 
    path: 'unitNumbers', 
    component: UnitNumberComponent, 
    canActivate: [AuthorizeGuard],
    data: { 
      roles : [Roles.COUNCIL, Roles.ADMIN] 
    } 
  },
  { 
    path: 'payment', 
    component: PaymentComponent, 
    canActivate: [AuthorizeGuard] 
  }
  //,{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
