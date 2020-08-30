import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CouncilDialog } from '../component/common-components/dialog/create-dialog-util';
import { SessionConstant } from '../constant/Constants';
import { ResponseErrorMessages } from '../constant/Messages';

@Injectable({
    providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

    constructor(
        private router: Router,
        private councilDialog: CouncilDialog) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        // Re-route to Login if Token does not exist or is expired:
        if (GuardUtils.isTokenExpired()) {
            this.router.navigate(['login']);
            return false;
        }

        // Dis-allow routing when user role is NOT specified in the route:
        let userRole = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);
        if (route.data.roles && !route.data.roles.includes(userRole)) {
            console.error(ResponseErrorMessages.NOT_ENOUGH_RIGHTS);
            this.councilDialog.openDialog(ResponseErrorMessages.ACCESS_FORBIDDEN,[ResponseErrorMessages.NOT_ENOUGH_RIGHTS]);
            return false;
        }

        // All cases successful:
        return true;
    }
}
@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // Re-route to Home when already logged in
        if (!GuardUtils.isTokenExpired()) {
            this.router.navigate(['home']);
            return true;
        }
        // Proceed to Login page when not yet logged in
        return true;
    }
}

class GuardUtils {
    
    public static isTokenExpired(): boolean {
        let token = window.sessionStorage[SessionConstant.LOGIN_TOKEN_KEY];

        // If no token found, user not logged in;
        if (!token) {
            return true;
        }

        // Check token expiry
        let expiryTime = JSON.parse(atob(token.split('.')[1])).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiryTime;
    }
}

