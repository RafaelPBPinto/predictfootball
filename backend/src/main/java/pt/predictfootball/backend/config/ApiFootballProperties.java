package pt.predictfootball.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "apifootball.api")
@Data
public class ApiFootballProperties {
    private String key;
    private String url;
}
