package org.luncert.mylifetimeline.model;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties("app")
public class AppProperties {

  private StorageProperties storage;

  private String[] corsAllowedOrigins;
}
