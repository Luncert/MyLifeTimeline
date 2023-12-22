package org.luncert.mylifetimeline.controller;

import static org.luncert.mylifetimeline.base.Constants.DIRECTORY;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.luncert.mylifetimeline.exception.InvalidPathException;
import org.luncert.mylifetimeline.exception.StorageException;
import org.luncert.mylifetimeline.model.StorageFile;
import org.luncert.mylifetimeline.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {

  private final StorageService storageService;

  @GetMapping("/{*path}")
  public ResponseEntity<?> getFile(@PathVariable("path") String path) throws IOException {
    StorageFile file = storageService.load(path);

    if (DIRECTORY.equals(file.getMediaType())) {
      return ResponseEntity.ok(storageService.listFiles(path));
    }

    Resource resource = storageService.loadAsResource(path);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.valueOf(file.getMediaType()));
    headers.setContentDispositionFormData("attachment", file.getName());
    headers.setContentLength(resource.contentLength());
    return new ResponseEntity<>(resource, headers, HttpStatus.OK);
  }

  @PostMapping("/{*path}")
  public void uploadFile(@PathVariable("path") String path, @RequestParam("file") MultipartFile file) {
    storageService.store(path, file);
  }

  @DeleteMapping("/{*path}")
  public void deleteFile(@PathVariable("path") String path) {
    storageService.delete(path);
  }

  @ExceptionHandler(InvalidPathException.class)
  public ResponseEntity<?> handleInvalidPathException(InvalidPathException e) {
    return ResponseEntity.notFound().build();
  }

  @ExceptionHandler(StorageException.class)
  public ResponseEntity<?> handleStorageException(StorageException e) {
    return ResponseEntity.internalServerError().body(e.getMessage());
  }
}
