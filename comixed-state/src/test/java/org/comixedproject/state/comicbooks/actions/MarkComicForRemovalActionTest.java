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

package org.comixedproject.state.comicbooks.actions;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertSame;
import static org.comixedproject.state.comicbooks.ComicStateHandler.HEADER_COMIC;

import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.comixedproject.model.comicbooks.Comic;
import org.comixedproject.model.comicbooks.ComicState;
import org.comixedproject.model.lists.ReadingList;
import org.comixedproject.state.comicbooks.ComicEvent;
import org.comixedproject.state.lists.ReadingListEvent;
import org.comixedproject.state.lists.ReadingListStateHandler;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.messaging.MessageHeaders;
import org.springframework.statemachine.StateContext;

@RunWith(MockitoJUnitRunner.class)
public class MarkComicForRemovalActionTest {
  @InjectMocks private MarkComicForRemovalAction action;
  @Mock private StateContext<ComicState, ComicEvent> context;
  @Mock private MessageHeaders messageHeaders;
  @Mock private Comic comic;
  @Mock private ReadingList readingList;
  @Mock private ReadingListStateHandler readingListStateHandler;

  @Captor private ArgumentCaptor<Date> deletedDateCaptor;
  @Captor private ArgumentCaptor<Map<String, ?>> headersArgumentCaptor;

  private Set<ReadingList> readingLists = new HashSet<>();

  @Before
  public void setUp() {
    Mockito.when(context.getMessageHeaders()).thenReturn(messageHeaders);
    Mockito.when(messageHeaders.get(Mockito.anyString(), Mockito.any(Class.class)))
        .thenReturn(comic);
    Mockito.when(comic.getReadingLists()).thenReturn(readingLists);
    readingLists.add(readingList);
  }

  @Test
  public void testExecute() {
    Mockito.doNothing().when(comic).setDateDeleted(deletedDateCaptor.capture());
    Mockito.doNothing()
        .when(readingListStateHandler)
        .fireEvent(
            Mockito.any(ReadingList.class),
            Mockito.any(ReadingListEvent.class),
            headersArgumentCaptor.capture());

    action.execute(context);

    final Map<String, ?> headers = headersArgumentCaptor.getAllValues().get(0);
    assertSame(comic, headers.get(HEADER_COMIC));

    assertNotNull(deletedDateCaptor.getValue());

    Mockito.verify(comic, Mockito.times(1)).setDateDeleted(deletedDateCaptor.getValue());
    readingLists.forEach(
        readingList ->
            Mockito.verify(readingListStateHandler, Mockito.times(1))
                .fireEvent(readingList, ReadingListEvent.comicRemoved, headers));
  }
}