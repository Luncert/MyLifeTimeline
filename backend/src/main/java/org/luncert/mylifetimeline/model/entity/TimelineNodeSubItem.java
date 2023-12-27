package org.luncert.mylifetimeline.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
public class TimelineNodeSubItem {

  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "time")
  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  private TimelineNode node;

  @Id
  private String filePath;

  private Integer x;

  private Integer y;

  private Integer rotation;

  private Double scale;
}
