package org.luncert.mylifetimeline;

import net.codecrete.usb.USB;
import org.luncert.mylifetimeline.model.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class App {

  public static void main(String[] args) {
    for (var device : USB.getAllDevices()) {
      System.out.println(device);
    }
    SpringApplication.run(App.class, args);
  }
}