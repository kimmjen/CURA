package com.cura.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CURA Backend API")
                        .version("1.0.0")
                        .description("YouTube video curation platform API - Pure Java version")
                        .contact(new Contact()
                                .name("CURA")
                                .url("https://github.com/kimmjen/CURA")));
    }
}
