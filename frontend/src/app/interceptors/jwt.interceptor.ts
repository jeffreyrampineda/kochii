import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // TODO: temporary fix - prevents reload on /login, /register component.
        if (request.url === '/public/login') {
            return next.handle(request);
        }
        if (request.url === '/public/register') {
            return next.handle(request);
        }

        // add authorization header with jwt token if available
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError(this.handleError(request.method, request.url))
        );
    }

  /**
   * Error handler used for any http errors.
   * @param operation - The type of operation used.
   * @param result - The results received.
   */
  private handleError(method: string, url: string) {
    return (error: any): Observable<any> => {

        console.log(`interceptor caught error from ${method} - ${url}`);

        if (error.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
        }

        // Let the app keep running by returning an empty result.
        return throwError(error);
        };
    }
}
