package org.luncert.mylifetimeline.repo;

import org.luncert.mylifetimeline.model.entity.TimelineNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITimelineNodeRepo extends JpaRepository<TimelineNode, Long> {
}
