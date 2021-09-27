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

package org.comixedproject.batch.comicpages.writers;

import java.util.ArrayList;
import java.util.List;
import org.comixedproject.model.comicpages.Page;
import org.comixedproject.service.comicpages.PageService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class UnmarkPageWithHashWriterTest {
  private static final long TEST_PAGE_ID = 213L;

  @InjectMocks private UnmarkPageWithHashWriter writer;
  @Mock private PageService pageService;
  @Mock private Page page;
  @Mock private Page savedPage;

  private List<Page> pageList = new ArrayList<>();

  @Before
  public void setUp() {
    Mockito.when(page.getId()).thenReturn(TEST_PAGE_ID);
    Mockito.when(pageService.save(Mockito.any(Page.class))).thenReturn(savedPage);
  }

  @Test
  public void testWrite() throws Exception {
    pageList.add(page);

    writer.write(pageList);

    Mockito.verify(pageService, Mockito.times(pageList.size())).save(page);
  }
}