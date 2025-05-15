package com.nexora.server.controller;

import java.util.Map;

public record UserResponse(String id, String email, String name, String profilePhotoUrl, String token, Map<String, String> _links) {}