import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            retry(1),
            catchError(this.handleError(request.method, request.url))
        );
    }

    private handleError(method: string, url: string) {
        return (error: any): Observable<any> => {

            console.error(`interceptor caught error from ${method} - ${url}`);

            if (error instanceof HttpErrorResponse) {

                // server-side error
                console.error(`server-side error: ${error.status} - Name: ${error.name}`);
                if (error.status === 401 && this.authenticationService.isLoggedIn()) {
                    // auto logout if 401 response returned from api
                    this.authenticationService.logout();
                }

            } else {

                // client-side error
                console.error(`client-side error: ${error.error.message}`);
            }

            // Let the app keep running by returning an empty result.
            return throwError(error);
        };
    }
}
