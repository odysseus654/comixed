/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2019, The ComiXed Project
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

package org.comixedproject.net;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <code>GetVolumesRequest</code>> represents the payload for requesting a set of volumes for a
 * given series.
 *
 * @author Darryl L. Pierce
 */
@AllArgsConstructor
public class GetVolumesRequest {
  @JsonProperty("apiKey")
  @Getter
  private final String apiKey;

  @JsonProperty("series")
  @Getter
  private final String series;

  @JsonProperty("maxRecords")
  @Getter
  private final Integer maxRecords;

  @JsonProperty("skipCache")
  @Getter
  private final Boolean skipCache;
}