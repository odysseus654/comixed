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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedListPageComponent } from './deleted-list-page.component';
import { LoggerModule } from '@angular-ru/cdk/logger';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  COMIC_BOOK_LIST_FEATURE_KEY,
  initialState as initialComicBookListState
} from '@app/comic-books/reducers/comic-book-list.reducer';
import { TitleService } from '@app/core/services/title.service';
import { ComicBook } from '@app/comic-books/models/comic-book';
import { COMIC_BOOK_1 } from '@app/comic-books/comic-books.fixtures';
import { PAGE_1, PAGE_2, PAGE_3 } from '@app/comic-pages/comic-pages.fixtures';
import { MatTableModule } from '@angular/material/table';
import { ComicTitlePipe } from '@app/comic-books/pipes/comic-title.pipe';

describe('DeletedListPageComponent', () => {
  const COMIC_BOOKS: ComicBook[] = [
    {
      ...COMIC_BOOK_1,
      pages: [
        { ...PAGE_1, deleted: false },
        { ...PAGE_2, deleted: true },
        { ...PAGE_3, deleted: true }
      ]
    }
  ];
  const initialState = {
    [COMIC_BOOK_LIST_FEATURE_KEY]: initialComicBookListState
  };

  let component: DeletedListPageComponent;
  let fixture: ComponentFixture<DeletedListPageComponent>;
  let titleService: TitleService;
  let setTitleSpy: jasmine.Spy<any>;
  let translateService: TranslateService;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletedListPageComponent, ComicTitlePipe],
      imports: [
        LoggerModule.forRoot(),
        TranslateModule.forRoot(),
        MatTableModule
      ],
      providers: [provideMockStore({ initialState }), TitleService]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedListPageComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(TitleService);
    setTitleSpy = spyOn(titleService, 'setTitle');
    translateService = TestBed.inject(TranslateService);
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the tab title', () => {
    expect(titleService.setTitle).toHaveBeenCalledWith(jasmine.any(String));
  });

  describe('when the language changes', () => {
    beforeEach(() => {
      setTitleSpy.calls.reset();
      translateService.use('fr');
    });

    it('updates the tab title', () => {
      expect(titleService.setTitle).toHaveBeenCalledWith(jasmine.any(String));
    });
  });

  describe('loading pages', () => {
    beforeEach(() => {
      component.dataSource.data = [];
      store.setState({
        ...initialState,
        [COMIC_BOOK_LIST_FEATURE_KEY]: {
          ...initialComicBookListState,
          comicBooks: COMIC_BOOKS
        }
      });
    });

    it('loads the pages', () => {
      expect(component.dataSource.data).not.toEqual([]);
    });

    it('loads only deletd pages', () => {
      expect(
        component.dataSource.data.every(entry => entry.page.deleted)
      ).toBeTrue();
    });
  });

  describe('sorting the pages', () => {
    const PAGE = PAGE_3;
    const COMIC = COMIC_BOOK_1;
    const ENTRY = { page: PAGE, comic: COMIC };

    it('sorts by comic', () => {
      expect(component.dataSource.sortingDataAccessor(ENTRY, 'comic')).toEqual(
        COMIC.coverDate
      );
    });

    it('sorts by filename', () => {
      expect(
        component.dataSource.sortingDataAccessor(ENTRY, 'filename')
      ).toEqual(PAGE.filename);
    });

    it('sorts by hash', () => {
      expect(component.dataSource.sortingDataAccessor(ENTRY, 'hash')).toEqual(
        PAGE.hash
      );
    });
  });
});
