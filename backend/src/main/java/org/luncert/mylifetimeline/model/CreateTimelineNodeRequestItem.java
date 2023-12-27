package org.luncert.mylifetimeline.model;

import lombok.Data;

@Data
public class CreateTimelineNodeRequestItem {

  private String filePath;

  private Integer x;

  private Integer y;

  private Integer rotation;

  private Double scale;
}
