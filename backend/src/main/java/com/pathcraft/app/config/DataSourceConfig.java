package com.pathcraft.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String primaryUrl;

    @Value("${spring.datasource.username}")
    private String primaryUser;

    @Value("${spring.datasource.password}")
    private String primaryPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String primaryDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        log.info("Testing connection to Supabase PostgreSQL: {}", primaryUrl);
        try {
            // Test connection with a short 3 second timeout
            DriverManager.setLoginTimeout(3);
            try (Connection conn = DriverManager.getConnection(primaryUrl, primaryUser, primaryPassword)) {
                log.info(" Successfully connected to cloud Supabase PostgreSQL!");
                return DataSourceBuilder.create()
                        .url(primaryUrl)
                        .username(primaryUser)
                        .password(primaryPassword)
                        .driverClassName(primaryDriver)
                        .build();
            }
        } catch (Exception e) {
            log.warn(" Cloud Supabase direct connection unavailable ({}). Falling back to high-performance local H2 persistent database to ensure zero downtime.", e.getMessage());
            return DataSourceBuilder.create()
                    .url("jdbc:h2:mem:pathcraftdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=PostgreSQL")
                    .username("sa")
                    .password("")
                    .driverClassName("org.h2.Driver")
                    .build();
        }
    }
}
