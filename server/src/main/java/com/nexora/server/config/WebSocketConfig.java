package com.nexora.server.config;

import com.nexora.server.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration class for enabling STOMP over WebSocket,
 * setting up endpoints, message broker, and authentication.
 */
@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private AuthenticationService authenticationService;

    /**
     * Configure the message broker with application and user destination prefixes,
     * and enable a simple broker with a custom task scheduler.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue")
              .setTaskScheduler(taskScheduler());
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    /**
     * Register the STOMP endpoint for WebSocket connections and enable SockJS fallback.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-notifications")
                .setAllowedOrigins("http://localhost:5173")
                .withSockJS();
    }

    /**
     * Configure the inbound channel to intercept and authenticate CONNECT frames using JWT.
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        try {
                            // Validate JWT and set the authenticated user
                            String userId = authenticationService.validateJwtToken(token).getId();
                            accessor.setUser(new UserPrincipal(userId));
                        } catch (Exception e) {
                            throw new RuntimeException("Invalid JWT token");
                        }
                    } else {
                        throw new RuntimeException("Missing or invalid Authorization header");
                    }
                }
                return message;
            }
        });
    }

    /**
     * Bean definition for the task scheduler used by the message broker for heartbeats.
     */
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(10);
        scheduler.setThreadNamePrefix("wss-heartbeat-thread-");
        scheduler.initialize();
        return scheduler;
    }

    /**
     * Simple implementation of java.security.Principal for associating a user ID with a WebSocket session.
     */
    private static class UserPrincipal implements java.security.Principal {
        private final String userId;

        public UserPrincipal(String userId) {
            this.userId = userId;
        }

        @Override
        public String getName() {
            return userId;
        }
    }
}