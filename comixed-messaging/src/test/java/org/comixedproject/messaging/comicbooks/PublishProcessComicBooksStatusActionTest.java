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

package org.comixedproject.messaging.comicbooks;

import static org.comixedproject.messaging.comicbooks.PublishProcessComicBooksStatusAction.PROCESS_COMIC_BOOKS_STATUS_TOPIC;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.comixedproject.messaging.PublishingException;
import org.comixedproject.model.messaging.batch.ProcessComicBooksStatus;
import org.comixedproject.views.View;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RunWith(MockitoJUnitRunner.class)
public class PublishProcessComicBooksStatusActionTest {
  private static final String TEST_STATUS_AS_JSON = "The status as JSON";

  @InjectMocks private PublishProcessComicBooksStatusAction action;
  @Mock private SimpMessagingTemplate messagingTemplate;
  @Mock private ObjectMapper objectMapper;
  @Mock private ObjectWriter objectWriter;
  @Mock private ProcessComicBooksStatus status;

  @Before
  public void setUp() throws JsonProcessingException {
    Mockito.when(objectMapper.writerWithView(Mockito.any())).thenReturn(objectWriter);
    Mockito.when(objectWriter.writeValueAsString(Mockito.any())).thenReturn(TEST_STATUS_AS_JSON);
  }

  @Test(expected = PublishingException.class)
  public void testPublishJsonProcessingException()
      throws PublishingException, JsonProcessingException {
    Mockito.when(objectWriter.writeValueAsString(Mockito.any()))
        .thenThrow(JsonProcessingException.class);

    try {
      action.publish(status);
    } finally {
      Mockito.verify(objectMapper, Mockito.times(1)).writerWithView(View.GenericObjectView.class);
    }
  }

  @Test
  public void testPublish() throws PublishingException, JsonProcessingException {
    Mockito.when(objectWriter.writeValueAsString(Mockito.any())).thenReturn(TEST_STATUS_AS_JSON);

    action.publish(status);

    Mockito.verify(objectMapper, Mockito.times(1)).writerWithView(View.GenericObjectView.class);
    Mockito.verify(objectWriter, Mockito.times(1)).writeValueAsString(status);
    Mockito.verify(messagingTemplate, Mockito.times(1))
        .convertAndSend(PROCESS_COMIC_BOOKS_STATUS_TOPIC, TEST_STATUS_AS_JSON);
    Mockito.verify(messagingTemplate, Mockito.times(1))
        .convertAndSend(PROCESS_COMIC_BOOKS_STATUS_TOPIC, TEST_STATUS_AS_JSON);
  }
}
