import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log(`Intercepting ${request.url}`);

        // TODO: temporary fix - prevents reload on /login, /register component.
        if (request.url === 'http://localhost:3001/public/login') {
            return next.handle(request);
        }
        if (request.url === 'http://localhost:3001/public/register') {
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
            catchError(this.handleError<any>())
        );
    }

  /**
   * Error handler used for any http errors.
   * @param operation - The type of operation used.
   * @param result - The results received.
   */
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {

        console.log('interceptor caught error');

        if (error.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();

            // TODO: Change this - reason: deprecated.
            location.reload(true);
        }

        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
}
