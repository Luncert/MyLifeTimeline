package org.luncert.mylifetimeline.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorageFile {

  private String name;

  private String mediaType;

  private String path;

  private long creationTime;

  private long lastAccessTime;

  private long lastModifiedTime;

  private String size;
}
