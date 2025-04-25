package com.nexora.server.controller;

public record UserRequest(
        String email,
        String password,
        String name,
        String username,
        String profilePhotoBase64
) {}