package org.luncert.mylifetimeline.config;

import org.luncert.mylifetimeline.model.AppProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS configuration for local development.
 */
@Configuration
@Profile("local")
public class CorsConfig implements WebMvcConfigurer {

  @Bean
  public FilterRegistrationBean<CorsFilter> corsFilter(
      AppProperties appProperties
  ) {
    CorsConfiguration config = new CorsConfiguration();
    for (String allowedOrigin : appProperties.getCorsAllowedOrigins()) {
      config.addAllowedOrigin(allowedOrigin);
    }
    config.setAllowCredentials(true);
    config.addAllowedHeader("*");
    config.addAllowedMethod("*");
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
    bean.setOrder(Integer.MIN_VALUE); // max priority
    return bean;
  }
}
