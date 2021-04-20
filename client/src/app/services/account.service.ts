import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../interfaces/user';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class AccountService {

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

    public get isLoggedIn(): boolean {
        return this.currentUserSubject.value ? true : false;
    }

    /**
     * Authenticates the user to the server.
     * @param user - The user to be authenticated.
     */
    login(user: User): Observable<User> {
        this.log('logging in');

        return this.http.post<User>('/api/login', user)
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
        this.log('registering');

        return this.http.post<User>('/api/register', user)
            .pipe(
                map(response => {
                    // Login if successful.
                    this.onAuthenticated(response);
                    return response;
                })
            );
    }

    /**
     * Authenticates the user to the server.
     * @param user - The user to be authenticated.
     */
    deleteAccount(): Observable<number> {
        this.log('deleting account');

        return this.http.delete<number>('/api/account');
    }

    /** Logs out the current user then reloads the page. */
    logout(): void {

        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);

        window.location.href = '/';
    }

// -------------------------------------------------------------

    /**
     * Adds the message to the messageService for logging.
     * @param message - The message to log.
     */
    private log(message: string, type: string = 'Message') {
        this.messageService.add(`accountService: ${message}`, type);
    }
}
