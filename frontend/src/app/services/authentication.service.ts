import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private authenticationUrl = '/public';
    private currentUserSubject: BehaviorSubject<User>;
    private currentUser: Observable<User>;

    constructor(
        private http: HttpClient,
        private router: Router,
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

    isLoggedIn(): boolean {
        return this.currentUserSubject.value ? true : false;
    }

    /**
     * Authenticates the user to the server.
     * @param user - The user to be authenticated.
     */
    login(user: User): Observable<User> {
        this.log("logging in");

        return this.http.post<User>(`${this.authenticationUrl}/login`, user)
            .pipe(
                map(response => {
                    this.onAuthenticated(response);
                    return response;
                })
            );
    }

    /**
     * Creates a new user to the server.
     * @param user - The new user to be created.
     */
    register(user: User): Observable<User> {
        this.log("registering");

        return this.http.post<User>(`${this.authenticationUrl}/register`, user)
            .pipe(
                map(response => {
                    // Login if successful.
                    this.onAuthenticated(response);
                    return response;
                })
            );
    }

    /** Logs out the current user then reloads the page. */
    logout(): void {

        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);

        this.router.navigate(['/home']);
    }

// -------------------------------------------------------------

    /**
     * Adds the message to the messageService for logging.
     * @param message - The message to log.
     */
    private log(message: string, type: string = 'Message') {
        this.messageService.add(`authenticationService: ${message}`, type);
    }
}
