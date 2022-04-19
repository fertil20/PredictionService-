package com.sigma.predictionService.dto;

import lombok.Data;

@Data
public class UserForListResponse {
    private Long id;
    private String username;
    private String name;
    private String email;


    public UserForListResponse(Long id, String username, String name, String email) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
    }
}
