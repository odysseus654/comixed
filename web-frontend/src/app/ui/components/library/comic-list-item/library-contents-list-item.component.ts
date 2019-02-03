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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { Component, OnInit, Input } from "@angular/core";
import { Comic } from "../../../../models/comics/comic";

@Component({
  selector: "app-library-contents-list-item",
  templateUrl: "./library-contents-list-item.component.html",
  styleUrls: ["./library-contents-list-item.component.css"]
})
export class LibraryContentsListItemComponent implements OnInit {
  @Input() comic: Comic;
  @Input() same_height: boolean;
  @Input() cover_size: number;

  constructor() {}

  ngOnInit() {}
}
