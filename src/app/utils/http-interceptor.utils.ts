import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { SessionConstant } from '../constant/Constants';
import { CouncilDialog } from '../component/dialog/create-dialog-util';
import { ResponseErrorMessages } from '../constant/Messages';

@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private councilDialog: CouncilDialog    
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                'Authorization': `Bearer ${window.sessionStorage.getItem(SessionConstant.LOGIN_TOKEN_KEY)}`,
                'Content-Type': 'application/json'
            },
            'responseType': 'json'
        });

        // Change response type on Login
        if (request.url.includes('login')) {
            request = request.clone({
                'responseType': 'text'
            });
        }

        return next.handle(request).pipe(catchError(error => {
            console.info("Interceptor Error");
            console.info(error);
            if ([401, 403].indexOf(error.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                let message: Array<string> = [ResponseErrorMessages.REDIRECT_LOGIN];
                this.councilDialog.openDialog(ResponseErrorMessages.ACCESS_FORBIDDEN, message);
                this.authService.logout();
                location.reload(true);
            }
            return throwError(error);
        }));
    }
}