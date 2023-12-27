package org.luncert.mylifetimeline.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.luncert.mylifetimeline.model.CreateTimelineNodeRequest;
import org.luncert.mylifetimeline.model.GetTimelineNodeResponse;
import org.luncert.mylifetimeline.model.GetTimelineNodeResponseItem;
import org.luncert.mylifetimeline.model.GetTimelineResponse;
import org.luncert.mylifetimeline.model.entity.TimelineNode;
import org.luncert.mylifetimeline.model.entity.TimelineNodeSubItem;
import org.luncert.mylifetimeline.repo.ITimelineNodeRepo;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimelineService {

  private final ModelMapper mapper;
  private final ITimelineNodeRepo repo;

  public void createNode(CreateTimelineNodeRequest request) {
    TimelineNode node = mapper.map(request, TimelineNode.class);
    List<TimelineNodeSubItem> subItems = request.getItems().stream()
        .map(item -> mapper.map(item, TimelineNodeSubItem.class))
        .peek(item -> item.setNode(node))
        .toList();
    node.setItems(subItems);
    repo.save(node);
  }

  public void deleteNode(long id) {
    repo.deleteById(id);
  }

  public GetTimelineResponse getTimeline() {
    List<GetTimelineNodeResponse> nodes = repo.findAll().stream()
        .map(node -> {
          GetTimelineNodeResponse n = mapper.map(node, GetTimelineNodeResponse.class);
          n.setItems(node.getItems().stream()
              .map(item -> mapper.map(item, GetTimelineNodeResponseItem.class))
              .toList());
          return n;
        })
        .toList();
    return new GetTimelineResponse(nodes);
  }
}
