/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2023, The ComiXed Project
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

import { createReducer, on } from '@ngrx/store';
import {
  resetActiveTheme,
  toggleDarkThemeMode
} from '../actions/dark-theme.actions';

export const DARK_THEME_FEATURE_KEY = 'dark_theme_state';

export interface DarkThemeState {
  toggle: boolean;
}

export const initialState: DarkThemeState = {
  toggle: false
};

export const reducer = createReducer(
  initialState,
  on(toggleDarkThemeMode, (state, action) => ({
    ...state,
    toggle: action.toggle
  })),
  on(resetActiveTheme, state => ({ ...state, toggle: false }))
);
