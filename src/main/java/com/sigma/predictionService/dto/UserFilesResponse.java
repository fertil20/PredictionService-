package com.sigma.predictionService.dto;


import lombok.Data;

@Data
public class UserFilesResponse {

    private Long Id;
    private String fileName;

    public UserFilesResponse(Long id, String fileName) {
        Id = id;
        this.fileName = fileName;
    }
}
