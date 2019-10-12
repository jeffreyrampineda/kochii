import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private authenticationUrl = '/public';
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    private onAuthenticated(response: User): void {
        // login successful if there's a jwt token in the response
        if (response && response.token) {

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
        }
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User): Observable<User> {
        return this.http.post<User>(`${this.authenticationUrl}/login`, user)
            .pipe(
                map(response => {

                    this.onAuthenticated(response);
                    return response;
                }),
                tap(_ => this.log(`logging in`)),
                catchError(this.handleError<User>('login'))
            );
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.authenticationUrl}/register`, user).pipe(

            // Login if successful.
            map(response => {
                this.onAuthenticated(response);
                return response;
            }),
            tap(_ => this.log(`registering`)),
            catchError(this.handleError<User>('register'))
        );
    }

    /**
     * Logs out the current user then reloads the page.
     */
    logout(): void {

        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);

        // TODO: Change this - reason: deprecated.
        location.reload(true);
    }

// -------------------------------------------------------------

    /**
     * Error handler used for any http errors.
     * @param operation - The type of operation used.
     * @param result - The results received.
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            this.log(`${error.status} - ${error.message}`, 'Error');

            // Do something before throwing to login/register component
            switch(error.status) {
                // 400 - Password too short.
                // 401 - Authentication failed.
                // 409 - Username already exists.
                // 504 - Cannot connect to server.

                case 400:
                case 401:
                case 409:
                    return throwError(error);
                case 504:

                    // Create appropriate error.message for displaying to user.
                    return throwError(new HttpErrorResponse({status: 504, error: "Connection to server failed"}))
                default:

                    // Create appropriate error.message for displaying to user.
                    return throwError(new HttpErrorResponse({status: error.status, error: "Unknown error"}));
            }
        };
    }

    /**
     * Adds the message to the messageService for logging.
     * @param message - The message to log.
     */
    private log(message: string, type: string = 'Message') {
        this.messageService.add(`authenticationService: ${message}`, type);
    }
}
