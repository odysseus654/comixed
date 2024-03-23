/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2022, The ComiXed Project
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

import { API_ROOT_URL } from '@app/core';
import { MetadataSource } from '@app/comic-metadata/models/metadata-source';

export const COMICVINE_ISSUE_LINK =
  'https://comicvine.gamespot.com/issues/4000-${id}/';

export const LOAD_METADATA_SOURCE_LIST_URL = `${API_ROOT_URL}/metadata/sources`;
export const LOAD_METADATA_SOURCE_URL = `${API_ROOT_URL}/metadata/sources/\${id}`;
export const CREATE_METADATA_SOURCE_URL = `${API_ROOT_URL}/metadata/sources`;
export const UPDATE_METADATA_SOURCE_URL = `${API_ROOT_URL}/metadata/sources/\${id}`;
export const DELETE_METADATA_SOURCE_URL = `${API_ROOT_URL}/metadata/sources/\${id}`;
export const MARK_METADATA_SOURCE_AS_PREFERRED_URL = `${API_ROOT_URL}/metadata/sources/\${id}/preferred`;
export const FETCH_ISSUES_FOR_VOLUME = `${API_ROOT_URL}/metadata/sources/\${id}/series/issues`;

export const METADATA_UPDATE_PROCESS_UPDATE_TOPIC =
  '/topic/metadata.update-process.update';

export const METADATA_SOURCE_TEMPLATE: MetadataSource = {
  id: null,
  name: '',
  preferred: false,
  available: false,
  properties: []
};
