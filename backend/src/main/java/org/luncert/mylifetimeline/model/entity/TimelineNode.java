package org.luncert.mylifetimeline.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.Data;

@Data
@Entity
public class TimelineNode {

  @Id
  private Long time;

  private String title;

  private String description;

  @OneToMany(mappedBy = "node", cascade = CascadeType.ALL)
  private List<TimelineNodeSubItem> items;
}
