package com.nexora.server.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpStatus;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Bean for password encoding using BCrypt
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Main security filter chain configuration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS with custom configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Disable CSRF protection (for APIs)
                .csrf(csrf -> csrf.disable())
                // Use session only if required (for OAuth2 login)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                // Configure endpoint authorization
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no authentication required)
                        .requestMatchers("/api/cuisines/**",
                                "/api/learningplan/**",
                                "/api/completedplans/**",
                                "/api/progress/**",
                                "/api/shoppinglist/**",
                                "/api/userplan/**", 
                                "/api/users/**", 
                                "/api/auth/**",
                                "/api/questions/**",
                                "/api/forum/comments/**",
                                "/api/forum/notifications/**",
                                "/api/tags/**",
                                "/api/communities/**",
                                "/api/posts/**",
                                "/api/feedposts/**",
                                "/api/challenges/**",
                                "/api/forum/**",
                                "/api/forum/notifications/**",
                                "/api/quizzes/**")
                        .permitAll()
                        // Allow OAuth2 endpoints without authentication
                        .requestMatchers("/oauth2/**").permitAll()
                        // Restrict admin endpoints to users with ADMIN role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        // All other requests require authentication
                        .anyRequest().authenticated())
                // Configure OAuth2 login
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/api/auth/google")
                        .defaultSuccessUrl("/api/auth/google-redirect", true)
                        .failureUrl("/api/auth/login/failure"))
                // Custom exception handling for unauthorized access
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.setHeader("Cache-Control", "no-store");
                            response.getWriter().write("{\"error\": \"Unauthorized access\"}");
                        }))
                // Disable default form login and HTTP Basic authentication
                .formLogin().disable()
                .httpBasic().disable()
                // Configure logout endpoint and response
                .logout()
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((req, res, auth) -> {
                    res.setStatus(HttpStatus.OK.value());
                    res.setContentType("application/json");
                    res.setHeader("Cache-Control", "no-store");
                    res.getWriter().write("{\"message\": \"Logged out successfully\"}");
                })
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID");

        return http.build();
    }

    // CORS configuration bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from frontend origin
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        // Allow common HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Allow credentials (cookies, authorization headers, etc.)
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Bean to publish HTTP session events (for session management)
    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}
