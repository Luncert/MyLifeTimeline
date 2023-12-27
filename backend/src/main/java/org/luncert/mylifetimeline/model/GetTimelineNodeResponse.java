package org.luncert.mylifetimeline.model;

import java.util.List;
import lombok.Data;

@Data
public class GetTimelineNodeResponse {

  private Long time;

  private String title;

  private String description;

  private List<GetTimelineNodeResponseItem> items;
}
