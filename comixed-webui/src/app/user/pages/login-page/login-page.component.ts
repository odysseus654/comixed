/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2020, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@angular-ru/cdk/logger';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserModuleState } from '@app/user';
import { Subscription } from 'rxjs';
import { selectUserState } from '@app/user/selectors/user.selectors';
import { loginUser } from '@app/user/actions/user.actions';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TitleService } from '@app/core/services/title.service';
import { setBusyState } from '@app/core/actions/busy.actions';
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH
} from '@app/user/user.constants';
import { selectInitialUserAccountState } from '@app/user/selectors/initial-user-account.selectors';
import { loadInitialUserAccount } from '@app/user/actions/initial-user-account.actions';

@Component({
  selector: 'cx-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy, AfterViewInit {
  loginForm: UntypedFormGroup;
  initialAccountSubscription: Subscription;
  userSubscription: Subscription;
  langChangeSubscription: Subscription;
  busy = false;
  private;

  constructor(
    private logger: LoggerService,
    private formBuilder: UntypedFormBuilder,
    private store: Store<UserModuleState>,
    private titleService: TitleService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.logger.trace('Creating the login form');
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(MIN_PASSWORD_LENGTH),
          Validators.maxLength(MAX_PASSWORD_LENGTH)
        ]
      ]
    });
    this.logger.trace('Subscribing to initial account state updates');
    this.initialAccountSubscription = this.store
      .select(selectInitialUserAccountState)
      .subscribe(state => {
        if (!state.busy && !state.hasExisting) {
          this.logger.trace('Redirecting to account creation page');
          this.router.navigateByUrl('/users/create/admin');
        }
      });
    this.logger.trace('Subscribing to user account updates');
    this.userSubscription = this.store
      .select(selectUserState)
      .subscribe(state => {
        this.busy = state.initializing || state.authenticating;
        if (state.authenticated) {
          this.logger.debug('Already authenticated: sending to home');
          this.router.navigateByUrl('/');
        }
      });
    this.logger.trace('Subscribing to language updates');
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      () => this.loadTranslations()
    );
  }

  get controls(): { [p: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  ngAfterViewInit(): void {
    this.logger.trace('Clear busy mode');
    this.store.dispatch(setBusyState({ enabled: false }));
  }

  ngOnInit(): void {
    this.loadTranslations();
    this.logger.trace('Checking for existing accounts');
    this.store.dispatch(loadInitialUserAccount());
  }

  ngOnDestroy(): void {
    this.logger.trace('Unsubscribing from initial user updates');
    this.logger.trace('Unsubscribing from user updates');
    this.userSubscription.unsubscribe();
    this.logger.trace('Unsubscribing from language change updates');
    this.langChangeSubscription.unsubscribe();
  }

  onSubmitLogin(): void {
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.logger.trace('Attempting to login user:', email);
    this.store.dispatch(loginUser({ email, password }));
  }

  loadTranslations(): void {
    this.titleService.setTitle(this.translateService.instant('login.title'));
  }
}
