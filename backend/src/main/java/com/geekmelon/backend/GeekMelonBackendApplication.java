package com.geekmelon.backend;

import com.geekmelon.backend.config.GeekMelonProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan(basePackageClasses = GeekMelonProperties.class)
public class GeekMelonBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GeekMelonBackendApplication.class, args);
    }
}
