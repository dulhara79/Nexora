package com.nexora.server.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private final Dotenv dotenv = Dotenv.load();

    @Bean
    public Cloudinary cloudinary() {
        try {
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", dotenv.get("CLOUDINARY_CLOUD_NAME"),
                "api_key", dotenv.get("CLOUDINARY_API_KEY"),
                "api_secret", dotenv.get("CLOUDINARY_API_SECRET")
            ));

            // Test connection by requesting account details
            cloudinary.api().ping(ObjectUtils.emptyMap());

            System.out.println();
            System.out.println("<> Cloudinary connection successful!");
            System.out.println();
            return cloudinary;

        } catch (Exception e) {
          System.out.println();
            System.err.println("X Error connecting to Cloudinary: " + e.getMessage());
            System.out.println();
            return null;
        }
    }
}
