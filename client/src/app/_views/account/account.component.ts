import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';

import { Account } from '../../interfaces/account';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  account!: Account;
  accountForm!: FormGroup;
  isEditting = false;

  constructor(
    private accountService: AccountService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAccount();
  }

  /** convenience getter for easy access to form fields */
  get f() {
    return this.accountForm.controls;
  }

  getAccount(): void {
    this.accountService.currentAccount.subscribe({
      next: (response) => {
        if (response) {
          this.account = response;
          this.accountForm = this.formBuilder.group({
            firstName: [
              this.account.firstName,
              [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
                Validators.pattern('^[a-zA-Z]*$'),
              ],
            ],
            lastName: [
              this.account.lastName,
              [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
                Validators.pattern('^[a-zA-Z]*$'),
              ],
            ],
          });
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  updateAccount(): void {
    if (this.accountForm.invalid) {
      this.messageService.notify('Forms are invalid');
      return;
    }

    const { firstName, lastName } = this.accountForm.value;

    this.accountService.updateAccount({ firstName, lastName }).subscribe({
      next: (response) => {
        this.account = response;
        this.messageService.notify('Account was successfully updated.');
      },
      error: () => {},
      complete: () => {
        this.toggleEdit();
      },
    });
  }

  deleteAccount(): void {
    this.accountService.deleteAccount().subscribe({
      next: (response) => {
        if (response === 1) {
          this.accountService.logout();
        }
      },
      error: () => {},
      complete: () => {},
    });
  }

  toggleEdit(): void {
    this.isEditting = !this.isEditting;
    this.f['firstName'].setValue(this.account.firstName);
    this.f['lastName'].setValue(this.account.lastName);
  }
}
