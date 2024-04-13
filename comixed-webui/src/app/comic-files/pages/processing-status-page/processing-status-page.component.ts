/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2024, The ComiXed Project
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

import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggerService } from '@angular-ru/cdk/logger';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectProcessingComicBooksState } from '@app/selectors/import-comic-books.selectors';

@Component({
  selector: 'cx-processing-status-page',
  templateUrl: './processing-status-page.component.html',
  styleUrls: ['./processing-status-page.component.scss']
})
export class ProcessingStatusPageComponent implements OnDestroy {
  comicImportStateSubscription: Subscription;
  importing = false;
  started = 0;
  total = 0;
  stepName = '';
  processed = 0;
  progress = 0;

  constructor(
    private logger: LoggerService,
    private store: Store<any>,
    private router: Router
  ) {
    this.logger.debug('Subscribing to comic import state updates');
    this.comicImportStateSubscription = this.store
      .select(selectProcessingComicBooksState)
      .subscribe(state => {
        this.importing = state.active;
        this.started = state.started;
        this.total = state.total;
        this.stepName = state.stepName;
        this.processed = state.processed;
        this.progress = (state.processed / state.total) * 100;
      });
  }

  ngOnDestroy(): void {
    this.logger.debug('Unsubscribing from comic import state updates');
    this.comicImportStateSubscription.unsubscribe();
  }
}
