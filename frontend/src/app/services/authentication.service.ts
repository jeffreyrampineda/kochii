import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private authenticationUrl = 'http://localhost:3001/public/login';
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(user: User): Observable<User> {
        return this.http.post<User>(this.authenticationUrl, user)
            .pipe(
                map(response => {

                    // login successful if there's a jwt token in the response
                    if (response && response.token) {

                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(response));
                        this.currentUserSubject.next(response);
                    }

                    return user;
                }),
                tap(_ => this.log(`logging in`)),
                catchError(this.handleError<User>('login'))
            );
    }

    logout(): void {

        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

// -------------------------------------------------------------

    /**
     * Error handler used for any http errors.
     * @param operation - The type of operation used.
     * @param result - The results received.
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return this.messageService.handleError<T>(operation, result);
    }

    /**
     * Adds the message to the messageService for logging.
     * @param message - The message to log.
     */
    private log(message: string) {
        this.messageService.add(`authenticationService: ${message}`);
    }
}
