package com.jobapptracker.jobapptracker.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
public class DatabaseHealthCheck {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseHealthCheck.class);

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Environment environment;

    @Bean
    public CommandLineRunner databaseHealthCheckRunner() {
        return args -> {
            logger.info("🔍 Checking database connection...");
            
            try (Connection connection = dataSource.getConnection()) {
                logger.info("✅ Database connection successful!");
                logger.info("📊 Connected to: {}", connection.getMetaData().getURL());
                logger.info("👤 Database user: {}", connection.getMetaData().getUserName());
                
                // Check if the job_applications table exists
                try {
                    connection.createStatement().executeQuery("SELECT 1 FROM job_applications LIMIT 1");
                    logger.info("✅ job_applications table exists and is accessible");
                } catch (SQLException e) {
                    logger.error("❌ job_applications table does not exist or is not accessible");
                    logger.error("💡 Please create the table in your Supabase dashboard:");
                    logger.error("   CREATE TABLE job_applications (");
                    logger.error("       id BIGSERIAL PRIMARY KEY,");
                    logger.error("       company VARCHAR(200) NOT NULL,");
                    logger.error("       role VARCHAR(200) NOT NULL,");
                    logger.error("       status VARCHAR(50) NOT NULL,");
                    logger.error("       notes VARCHAR(2000)");
                    logger.error("   );");
                    throw new RuntimeException("Database table 'job_applications' not found. Please create it in Supabase.", e);
                }
                
            } catch (SQLException e) {
                logger.error("❌ Database connection failed!");
                logger.error("🔗 Attempted to connect to: {}", environment.getProperty("spring.datasource.url"));
                logger.error("👤 Username: {}", environment.getProperty("spring.datasource.username"));
                logger.error("💡 Error: {}", e.getMessage());
                
                if (e.getMessage().contains("Connect timed out")) {
                    logger.error("⏰ Connection timeout - possible issues:");
                    logger.error("   • Supabase project is not active");
                    logger.error("   • Database credentials are incorrect");
                    logger.error("   • Network/firewall blocking connection");
                    logger.error("   • Supabase URL is wrong");
                }
                
                throw new RuntimeException("Failed to connect to Supabase database. Please check your configuration.", e);
            }
        };
    }
}
