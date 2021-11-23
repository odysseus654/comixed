/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2021, The ComiXed Project
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

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadServerHealth,
  loadServerHealthFailed,
  serverHealthLoaded,
  serverShutdown,
  shutdownServer,
  shutdownServerFailed
} from '../actions/server-runtime.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LoggerService } from '@angular-ru/cdk/logger';
import { ServerRuntimeService } from '@app/admin/services/server-runtime.service';
import { AlertService } from '@app/core/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ServerHealth } from '@app/admin/models/server-health';

@Injectable()
export class ServerRuntimeEffects {
  loadServerHealth$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadServerHealth),
      tap(action => this.logger.trace('Loading server health:', action)),
      switchMap(action =>
        this.serverRuntimeService.loadServerHealth().pipe(
          tap(response => this.logger.debug('Response received:', response)),
          map((response: ServerHealth) =>
            serverHealthLoaded({ health: response })
          ),
          catchError(error => {
            this.logger.error('Service failure:', error);
            this.alertService.error(
              this.translateService.instant('server-health.effect-failure')
            );
            return of(loadServerHealthFailed());
          })
        )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(loadServerHealthFailed());
      })
    );
  });

  shutdownServer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(shutdownServer),
      tap(action => this.logger.trace('Shutting down server:', action)),
      tap(() =>
        this.alertService.info(
          this.translateService.instant('shutdown-server.effect-success')
        )
      ),
      switchMap(action =>
        this.serverRuntimeService.shutdownServer().pipe(
          tap(response => this.logger.debug('Response received:', response)),
          map(() => serverShutdown()),
          catchError(error => {
            this.logger.error('Service failure:', error);
            this.alertService.error(
              this.translateService.instant('shutdown-server.effect-failure')
            );
            return of(shutdownServerFailed());
          })
        )
      ),
      catchError(error => {
        this.logger.error('General failure:', error);
        this.alertService.error(
          this.translateService.instant('app.general-effect-failure')
        );
        return of(shutdownServerFailed());
      })
    );
  });

  constructor(
    private logger: LoggerService,
    private actions$: Actions,
    private serverRuntimeService: ServerRuntimeService,
    private alertService: AlertService,
    private translateService: TranslateService
  ) {}
}