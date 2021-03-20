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

package org.comixedproject.controller.library;

import com.fasterxml.jackson.annotation.JsonView;
import java.security.Principal;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.comixedproject.auditlog.AuditableEndpoint;
import org.comixedproject.model.archives.ArchiveType;
import org.comixedproject.model.comic.Comic;
import org.comixedproject.model.net.*;
import org.comixedproject.model.net.library.MoveComicsRequest;
import org.comixedproject.model.net.library.SetReadStateRequest;
import org.comixedproject.service.comic.ComicService;
import org.comixedproject.service.library.LibraryException;
import org.comixedproject.service.library.LibraryService;
import org.comixedproject.service.library.ReadingListService;
import org.comixedproject.service.user.UserService;
import org.comixedproject.task.model.ConvertComicsWorkerTask;
import org.comixedproject.task.model.MoveComicsWorkerTask;
import org.comixedproject.task.runner.TaskManager;
import org.comixedproject.views.View;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api")
@Log4j2
public class LibraryController {
  @Autowired private LibraryService libraryService;
  @Autowired private ComicService comicService;
  @Autowired private UserService userService;
  @Autowired private ReadingListService readingListService;
  @Autowired private TaskManager taskManager;
  @Autowired private ObjectFactory<ConvertComicsWorkerTask> convertComicsWorkerTaskObjectFactory;
  @Autowired private ObjectFactory<MoveComicsWorkerTask> moveComicsWorkerTaskObjectFactory;

  @PostMapping(value = "/library/convert", consumes = MediaType.APPLICATION_JSON_VALUE)
  @AuditableEndpoint
  public void convertComics(@RequestBody() ConvertComicsRequest request) {
    List<Long> idList = request.getComicIdList();
    ArchiveType archiveType = request.getArchiveType();
    boolean renamePages = request.isRenamePages();
    boolean deletePages = request.isDeletePages();
    boolean deleteOriginal = request.isDeleteOriginal();

    log.info(
        "Converting {} comic{} to {}{}{}{}",
        idList.size(),
        idList.size() == 1 ? "" : "s",
        archiveType,
        renamePages ? " (rename pages)" : "",
        deletePages ? " (delete pages)" : "",
        deleteOriginal ? " (delete original comic)" : "");

    final ConvertComicsWorkerTask task = this.convertComicsWorkerTaskObjectFactory.getObject();
    task.setIdList(idList);
    task.setTargetArchiveType(archiveType);
    task.setRenamePages(renamePages);
    task.setDeletePages(deletePages);
    task.setDeleteOriginal(deleteOriginal);

    this.taskManager.runTask(task);
  }

  @PostMapping(
      value = "/library/consolidate",
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @JsonView(View.DeletedComicList.class)
  @AuditableEndpoint
  public List<Comic> consolidateLibrary(@RequestBody() ConsolidateLibraryRequest request) {
    log.info("Consolidating library: delete physic files={}", request.getDeletePhysicalFiles());
    return this.libraryService.consolidateLibrary(request.getDeletePhysicalFiles());
  }

  @DeleteMapping(value = "/library/cache/images")
  @AuditableEndpoint
  public ClearImageCacheResponse clearImageCache() {
    log.info("Clearing the image cache");

    try {
      this.libraryService.clearImageCache();
    } catch (LibraryException error) {
      log.error("failed to clear image cache", error);
      return new ClearImageCacheResponse(false);
    }

    return new ClearImageCacheResponse(true);
  }

  /**
   * Consolidates the library, moving all comics under the specified parent directory and using
   * given naming rules. Will delete comics marked for deletion as well.
   *
   * @param request the request body
   */
  @PostMapping(
      value = "/library/move",
      produces = MediaType.APPLICATION_JSON_VALUE,
      consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  @AuditableEndpoint
  public void moveComics(@RequestBody() MoveComicsRequest request) {
    String targetDirectory = request.getTargetDirectory();
    String renamingRule = request.getRenamingRule();
    Boolean deletePhysicalFiles = request.getDeletePhysicalFiles();

    log.info("Moving comics: targetDirectory={}", targetDirectory);
    log.info("             : renamingRule={}", renamingRule);

    final MoveComicsWorkerTask task = this.moveComicsWorkerTaskObjectFactory.getObject();
    task.setDirectory(targetDirectory);
    task.setRenamingRule(renamingRule);

    this.taskManager.runTask(task);
  }

  /**
   * Sets the read state for a set of comics.
   *
   * @param principal the user principal
   * @param request the request body
   * @throws LibraryException if an error occurs
   */
  @PostMapping(value = "/library/read", consumes = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  @AuditableEndpoint
  public void setReadState(final Principal principal, @RequestBody() SetReadStateRequest request)
      throws LibraryException {
    final String email = principal.getName();
    final List<Long> ids = request.getIds();
    final boolean read = request.getRead();
    log.info("Marking comics as {} for {}", read ? "read" : "unread", email);
    this.libraryService.setReadState(email, ids, read);
  }
}
