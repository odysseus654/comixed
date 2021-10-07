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

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItem } from '@app/core/models/ui/list-item';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from '@app/core/services/confirmation.service';
import { Store } from '@ngrx/store';
import { LoggerService } from '@angular-ru/logger';
import { ConfigurationOption } from '@app/admin/models/configuration-option';
import { getConfigurationOption } from '@app/admin';
import {
  LIBRARY_RENAMING_RULE,
  LIBRARY_ROOT_DIRECTORY
} from '@app/admin/admin.constants';
import { saveConfigurationOptions } from '@app/admin/actions/save-configuration-options.actions';

@Component({
  selector: 'cx-library-configuration',
  templateUrl: './library-configuration.component.html',
  styleUrls: ['./library-configuration.component.scss']
})
export class LibraryConfigurationComponent implements OnInit {
  @Input() libraryConfigurationForm: FormGroup;

  readonly variableOptions: ListItem<string>[] = [
    {
      label: '$PUBLISHER',
      value: 'configuration.text.renaming-rule-publisher'
    },
    { label: '$SERIES', value: 'configuration.text.renaming-rule-series' },
    { label: '$VOLUME', value: 'configuration.text.renaming-rule-volume' },
    {
      label: '$ISSUE',
      value: 'configuration.text.renaming-rule-issue-number'
    },
    {
      label: '$COVERDATE',
      value: 'configuration.text.renaming-rule-cover-date'
    },
    {
      label: '$PUBYEAR',
      value: 'configuration.text.renaming-rule-published-year'
    }
  ];

  constructor(
    private logger: LoggerService,
    private formBuilder: FormBuilder,
    private store: Store<any>,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    this.libraryConfigurationForm = this.formBuilder.group({
      rootDirectory: ['', [Validators.required]],
      renamingRule: ['', []]
    });
  }

  @Input() set options(options: ConfigurationOption[]) {
    this.logger.trace('Loading configuration options');
    this.libraryConfigurationForm.controls.rootDirectory.setValue(
      getConfigurationOption(options, LIBRARY_ROOT_DIRECTORY, '')
    );
    this.libraryConfigurationForm.controls.renamingRule.setValue(
      getConfigurationOption(options, LIBRARY_RENAMING_RULE, '')
    );
  }

  ngOnInit(): void {}

  onSave(): void {
    this.logger.trace('Save configuration called');
    this.confirmationService.confirm({
      title: this.translateService.instant(
        'save-configuration.confirmation-title'
      ),
      message: this.translateService.instant(
        'save-configuration.confirmation-message'
      ),
      confirm: () => {
        this.logger.trace('Save configuration confirmed');
        this.store.dispatch(
          saveConfigurationOptions({ options: this.encodeOptions() })
        );
      }
    });
  }

  private encodeOptions(): ConfigurationOption[] {
    return [
      {
        name: LIBRARY_ROOT_DIRECTORY,
        value: this.libraryConfigurationForm.controls.rootDirectory.value
      },
      {
        name: LIBRARY_RENAMING_RULE,
        value: this.libraryConfigurationForm.controls.renamingRule.value
      }
    ];
  }
}
