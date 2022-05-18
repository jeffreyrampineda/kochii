import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Account } from '../interfaces/account';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class AccountService {

    private currentAccountSubject: BehaviorSubject<Account>;
    public currentAccount: Observable<Account>;

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) {
        this.currentAccountSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('currentAccount')));
        this.currentAccount = this.currentAccountSubject.asObservable();
    }

    private onAuthenticated(account: Account): void {
        // login successful if there's a jwt token in the response
        if (account && account.token) {

            // store account details and jwt token in local storage to keep account logged in between page refreshes
            this.setLocalStorageCurrentAccount(account);
        }
    }

    private setLocalStorageCurrentAccount(account: Account): void {
        localStorage.setItem('currentAccount', JSON.stringify(account));
        this.currentAccountSubject.next(account);
    }

    public get currentAccountValue(): Account {
        return this.currentAccountSubject.value;
    }

    public get isLoggedIn(): boolean {
        return this.currentAccountSubject.value ? true : false;
    }

    /**
     * Authenticates the account.
     * @param account - The account to be authenticated.
     */
    login(account: Account): Observable<Account> {
        this.log('logging in');

        return this.http.post<Account>('/login', account).pipe(
            map(response => {
                this.onAuthenticated(response);
                return response;
            })
        );
    }

    /**
     * Creates a new account.
     * @param account - The new account to be created.
     */
    register(account: Account): Observable<Account> {
        this.log('registering');

        return this.http.post<Account>('/register', account).pipe(
            map(response => {
                // Login if successful.
                this.onAuthenticated(response);
                return response;
            })
        );
    }

    updateAccount(newAccount: Account): Observable<Account> {
        this.log('updating');

        return this.http.put<Account>('/api/account', newAccount).pipe(
            map(updatedAccountFragment => {
                const updatedAccount = Object.assign(this.currentAccountValue, updatedAccountFragment);
                this.setLocalStorageCurrentAccount(updatedAccount);
                return updatedAccount;
            })
        );
    }

    /** Deletes the account. */
    deleteAccount(): Observable<number> {
        this.log('deleting account');

        return this.http.delete<number>('/api/account');
    }

    /** Logout then reload the page. */
    logout(): void {

        // remove account from local storage to logout.
        localStorage.removeItem('currentAccount');
        this.currentAccountSubject.next(null);

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
