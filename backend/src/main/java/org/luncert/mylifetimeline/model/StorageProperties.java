package org.luncert.mylifetimeline.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import java.io.IOException;
import lombok.Data;

@Data
public class StorageProperties {

  private String path;

  private StartupMode startupMode;

  @JsonDeserialize(using = StartupModeDeserializer.class)
  public enum StartupMode {
    OVERWRITE,
    APPEND
  }

  public static class StartupModeDeserializer extends StdDeserializer<StartupMode> {

    protected StartupModeDeserializer(Class<?> vc) {
      super(vc);
    }

    @Override
    public StartupMode deserialize(JsonParser jsonParser,
                                   DeserializationContext deserializationContext) throws IOException {
      JsonNode node = jsonParser.getCodec().readTree(jsonParser);
      return StartupMode.valueOf(node.asText());
    }
  }
}
