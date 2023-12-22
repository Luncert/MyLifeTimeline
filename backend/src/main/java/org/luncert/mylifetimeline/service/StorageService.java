package org.luncert.mylifetimeline.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.luncert.mylifetimeline.base.Constants;
import org.luncert.mylifetimeline.exception.StorageException;
import org.luncert.mylifetimeline.exception.InvalidPathException;
import org.luncert.mylifetimeline.model.AppProperties;
import org.luncert.mylifetimeline.model.StorageFile;
import org.luncert.mylifetimeline.model.StorageProperties;
import org.modelmapper.internal.util.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
public class StorageService {

  private final Path rootLocation;

  @Autowired
  public StorageService(AppProperties appProperties) throws IOException {
    String storagePath = appProperties.getStorage().getPath();
    File file = new File(storagePath);
    if (!file.exists()) {
      Assert.isTrue(file.mkdirs(), "failed to init storage path");
    } else if (!file.isDirectory()) {
      throw new IllegalArgumentException(storagePath + " already exists and is not a directory");
    } else if (StorageProperties.StartupMode.OVERWRITE.equals(
        appProperties.getStorage().getStartupMode())) {
      FileUtils.cleanDirectory(file);
    }

    rootLocation = Paths.get(storagePath);
  }

  public StorageFile load(String path) {
    return load(resolvePath(path));
  }

  public List<StorageFile> listFiles(String path) {
    Path destinationFile = resolvePath(path);
    try (Stream<Path> s = Files.walk(destinationFile, 1)) {
      return s.filter(p -> !p.equals(destinationFile))
          .map(this::load).collect(Collectors.toList());
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  public Resource loadAsResource(String path) {
    try {
      Path file = resolvePath(path);
      Resource resource = new UrlResource(file.toUri());
      if (resource.exists() || resource.isReadable()) {
        return resource;
      } else {
        throw new InvalidPathException("Could not access path: " + path);

      }
    } catch (MalformedURLException e) {
      throw new InvalidPathException("Could not access path: " + path, e);
    }
  }

  public void createDirectory(String path) {
    Path p = resolvePath(path);
    try {
      FileUtils.forceMkdir(p.toFile());
    } catch (IOException e) {
      throw new StorageException("Could not create directory", e);
    }
  }

  public void store(String path, MultipartFile file) {
    try {
      if (file.isEmpty()) {
        throw new StorageException("Failed to store empty file.");
      }

      Path directory = resolvePath(path);
      Path destinationFile = directory.resolve(file.getOriginalFilename());
      checkPath(destinationFile);
      try (InputStream inputStream = file.getInputStream()) {
        Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
      }
    } catch (IOException e) {
      throw new StorageException("Failed to store file.", e);
    }
  }

  public void delete(String path) {
    Path destinationFile = resolvePath(path);
    try {
      FileUtils.forceDelete(destinationFile.toFile());
    } catch (IOException e) {
      throw new StorageException("Could not delete path: " + path, e);
    }
  }

  private StorageFile load(Path path) {
    if (path.equals(rootLocation)) {
      return new StorageFile("/", Constants.DIRECTORY);
    }

    File file = path.toFile();
    if (!file.exists()) {
      throw new InvalidPathException("Cannot access path: " + file);
    }

    String fileName = file.getName();
    String contentType = file.isDirectory()
        ? Constants.DIRECTORY
        : URLConnection.guessContentTypeFromName(fileName);
    if (contentType == null) {
      contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
    return new StorageFile(fileName, contentType);
  }

  private Path resolvePath(String path) {
    path = path.replaceFirst("[/\\\\]+", "");
    Path r = rootLocation.resolve(path).normalize().toAbsolutePath();
    checkPath(r);
    return r;
  }

  private void checkPath(Path path) {
    // security check
    if (!path.toAbsolutePath().startsWith(rootLocation.toAbsolutePath())) {
      throw new StorageException("Invalid path outside the work directory: " + path);
    }
  }
}
