package org.luncert.mylifetimeline.http;

import lombok.RequiredArgsConstructor;
import org.luncert.mylifetimeline.model.CreateTimelineNodeRequest;
import org.luncert.mylifetimeline.model.GetTimelineResponse;
import org.luncert.mylifetimeline.service.TimelineService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/timeline")
@RequiredArgsConstructor
public class TimelineController {

  private final TimelineService service;

  @PostMapping("/node")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public void createNode(CreateTimelineNodeRequest request) {
    service.createNode(request);
  }

  @DeleteMapping("/node/{id}")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public void deleteNode(@PathVariable long id) {
    service.deleteNode(id);
  }

  @GetMapping
  public GetTimelineResponse getTimeline() {
    return service.getTimeline();
  }
}
