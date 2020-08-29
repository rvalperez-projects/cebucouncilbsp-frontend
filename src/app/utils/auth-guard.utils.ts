import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionConstant } from '../constant/Constants';

@Injectable({
    providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

    constructor(
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        // Allow when token is not yet expired
        if (!this.isTokenExpired()) {
            return true;
        }

        // Allow routing when user role is specified in the route
        let userRole = window.sessionStorage.getItem(SessionConstant.USER_ROLE_CODE_KEY);
        if (route.data.roles && route.data.roles.contains(userRole)) {
            return true;
        }

        // Disallow routing
        this.router.navigate([state.url]);
        return false;
    }

    private isTokenExpired(): boolean {
        let token = window.sessionStorage[SessionConstant.LOGIN_TOKEN_KEY];

        // If no token found, user not logged in;
        if (!token) {
            console.error("No User is logged in. No token found.");
            return true;
        }

        // Check token expiry
        let expiryTime = JSON.parse(atob(token.split('.')[1])).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiryTime;
    }
}

