package com.sigma.predictionService.dto;


import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class UserProfile {
    private Long id;
    private String username;
    private String name;
    private String email;



    public UserProfile(Long id, String username, String name, String email) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
    }

}
