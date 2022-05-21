/*
 * ComiXed - A digital comicBook book library management application.
 * Copyright (C) 2017, The ComiXed Project
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

package org.comixedproject.adaptors.content;

import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static junit.framework.TestCase.*;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import org.comixedproject.model.comicbooks.ComicBook;
import org.comixedproject.model.metadata.ComicInfo;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(
    classes = {ComicMetadataContentAdaptor.class, MappingJackson2XmlHttpMessageConverter.class})
public class ComicMetadataContentAdaptorTest extends BaseContentAdaptorTest {
  private static final String TEST_COMICINFO_FILE_COMPLETE =
      "src/test/resources/ComicInfo-complete.xml";
  private static final String TEST_COMICINFO_FILE_NOT_XML =
      "src/test/resources/application.properties";
  private static final String TEST_PUBLISHER_NAME = "Test Publisher";
  private static final String TEST_SERIES_NAME = "Test Series";
  private static final String TEST_VOLUME_NAME = "2011";
  private static final String TEST_ISSUE_NUMBER = "24";
  private static final String TEST_TITLE = "Test Title";
  private static final String TEST_DESCRIPTION = "Test summary <em>inner tag</em>";

  @Autowired ComicMetadataContentAdaptor adaptor;

  private ComicBook comicBook = new ComicBook();

  @Before
  public void setup() {
    adaptor.xmlConverter.getObjectMapper().configure(FAIL_ON_UNKNOWN_PROPERTIES, false);
  }

  @Test(expected = ContentAdaptorException.class)
  public void testLoadComicInfoXmlNotXml() throws IOException, ContentAdaptorException {
    adaptor.loadContent(
        comicBook, TEST_COMICINFO_FILE_COMPLETE, loadFile(TEST_COMICINFO_FILE_NOT_XML));
  }

  @Test
  public void testLoadComicInfoXml() throws IOException, ContentAdaptorException {
    adaptor.loadContent(
        comicBook, TEST_COMICINFO_FILE_COMPLETE, loadFile(TEST_COMICINFO_FILE_COMPLETE));

    assertFalse(comicBook.getCharacters().isEmpty());
    assertFalse(comicBook.getTeams().isEmpty());
    assertFalse(comicBook.getLocations().isEmpty());
    assertFalse(comicBook.getStories().isEmpty());
    assertFalse(comicBook.getCredits().isEmpty());

    assertEquals(comicBook.getPublisher(), TEST_PUBLISHER_NAME);
    assertEquals(comicBook.getSeries(), TEST_SERIES_NAME);
    assertEquals(comicBook.getVolume(), TEST_VOLUME_NAME);
    assertEquals(comicBook.getIssueNumber(), TEST_ISSUE_NUMBER);
    assertEquals(comicBook.getTitle(), TEST_TITLE);
    assertEquals(comicBook.getDescription(), TEST_DESCRIPTION);
  }

  @Test
  public void testCreateContent() throws ContentAdaptorException, IOException {
    final ComicInfo expected =
        adaptor
            .xmlConverter
            .getObjectMapper()
            .readValue(new FileInputStream(TEST_COMICINFO_FILE_COMPLETE), ComicInfo.class);

    adaptor.loadContent(
        comicBook, TEST_COMICINFO_FILE_COMPLETE, loadFile(TEST_COMICINFO_FILE_COMPLETE));

    final byte[] result = adaptor.createContent(comicBook);

    final ComicInfo outcome =
        adaptor
            .xmlConverter
            .getObjectMapper()
            .readValue(new ByteArrayInputStream(result), ComicInfo.class);
    assertNotNull(outcome);
  }
}
