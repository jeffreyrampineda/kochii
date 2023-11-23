import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private accountService: AccountService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            retry(1),
            catchError(this.handleError(request.method, request.url))
        );
    }

    private handleError(method: string, url: string) {
        return (error: any): Observable<any> => {
            if (error instanceof HttpErrorResponse) {
                // server-side error
                console.error(`server-side error: ${method} - ${url} - ${error.status} - Name: ${error.name}`, error);
                if (error.status === 401 && this.accountService.isLoggedIn) {
                    // auto logout if 401 response returned from api
                    this.accountService.logout();
                }

            } else {
                // client-side error
                console.error(`client-side error: ${error.error.message}`);
            }
            // Let the app keep running by returning an empty result.
            return throwError(() => error);
        };
    }
}
