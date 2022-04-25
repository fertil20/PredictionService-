package com.sigma.predictionService.dto;


import lombok.Data;

@Data
public class UserFilesResponse {

    private Long id;
    private String fileName;
    private String createDateTime;

    public UserFilesResponse(Long id, String fileName, String createDateTime) {
        this.id = id;
        this.fileName = fileName;
        this.createDateTime = createDateTime;
    }
}
