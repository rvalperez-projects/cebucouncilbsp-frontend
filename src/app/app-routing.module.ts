import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { FormsListComponent } from './component/forms-list/forms-list.component';
import { FormRegistrationComponent } from './component/form-registration/form-registration.component';
import { AurFormViewComponent } from './component/aur-form-view/aur-form-view.component';
import { AurFormUpdateComponent } from './component/aur-form-update/aur-form-update.component';
import { UsersListComponent } from './component/users-list/users-list.component';
import { PaymentComponent } from './component/payment/payment.component';
import { Roles } from './constant/Constants';
import { AuthorizeGuard } from './utils/auth-guard.utils';

const routes: Routes = [
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: 'login' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'home', 
    component: FormsListComponent, 
    canActivate: [AuthorizeGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthorizeGuard] 
  },
  { 
    path: 'forms', 
    component: FormsListComponent, 
    canActivate: [AuthorizeGuard],
    children: [
      { 
        path: 'new', 
        component: FormRegistrationComponent, 
        canActivate: [AuthorizeGuard],
        data: { 
          roles : [Roles.GENERAL_USER] 
        }
      },
      { 
        path: ':id', 
        component: AurFormViewComponent, 
        canActivate: [AuthorizeGuard] 
      },
      { 
        path: 'update/:id', 
        component: AurFormUpdateComponent, 
        canActivate: [AuthorizeGuard],
        data: { 
          roles : [Roles.COUNCIL, Roles.ADMIN] 
        } 
      }
    ]
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
