package com.sigma.predictionService.dto;

import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Long id;
    private String username;
    private String email;
    public JwtResponse(String accessToken, String refreshToken, Long id, String username, String email) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.username = username;
        this.email = email;
    }
    // getters and setters
}
