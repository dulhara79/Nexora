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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpStatus;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // http
    // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    // .csrf(csrf -> csrf.disable())
    // .sessionManagement(session ->
    // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    // .authorizeHttpRequests(auth -> auth
    // .requestMatchers("/api/users/**", "/api/auth/**").permitAll() // Allow all
    // user and auth
    // // endpoints
    // .requestMatchers("/api/admin/**").hasRole("ADMIN") // Allow admin endpoints
    // only for users with
    // // ADMIN role
    // .anyRequest().authenticated())
    // .oauth2Login(oauth2 -> oauth2
    // .loginPage("/api/auth/google") // Custom login endpoint
    // .defaultSuccessUrl("/api/users/google-success", true)
    // .failureUrl("/api/users/login/failure"))
    // .exceptionHandling(exception -> exception
    // .authenticationEntryPoint((request, response, authException) -> {
    // response.setStatus(HttpStatus.UNAUTHORIZED.value());
    // response.setContentType("application/json");
    // response.getWriter().write("{\"error\": \"Unauthorized access\"}");
    // }))
    // .formLogin().disable()
    // .httpBasic().disable()
    // .logout()
    // .logoutUrl("/api/users/logout")
    // .logoutSuccessHandler((req, res, auth) ->
    // res.setStatus(HttpStatus.OK.value()))
    // .invalidateHttpSession(true)
    // .deleteCookies("JSESSIONID")
    // .and()
    // .sessionManagement()
    // .maximumSessions(1)
    // .expiredUrl("/login?expired");
    // return http.build();
    // }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                // Use IF_REQUIRED instead of STATELESS to support HttpSession for OTP flow
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/**", "/api/auth/**", "/api/questions/**", "/api/comments/**", "/api/notifications/**", "/api/tags/**", "/api/communities/**", "/api/posts/**").permitAll() // Ensure all auth and user
                                                                                      // endpoints are public
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/api/auth/google")
                        .defaultSuccessUrl("/api/auth/google-success", true) // Adjust to match AuthenticationController
                        .failureUrl("/api/auth/login/failure")) // Adjust to match AuthenticationController
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized access\"}");
                        }))
                .formLogin().disable()
                .httpBasic().disable()
                .logout()
                .logoutUrl("/api/auth/logout") // Match AuthenticationController
                .logoutSuccessHandler((req, res, auth) -> res.setStatus(200))
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID");

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }
}