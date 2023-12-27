package org.luncert.mylifetimeline.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetTimelineResponse {

  private List<GetTimelineNodeResponse> nodes;
}
