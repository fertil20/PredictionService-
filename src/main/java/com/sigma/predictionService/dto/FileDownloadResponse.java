package com.sigma.predictionService.dto;


import lombok.Data;

@Data
public class FileDownloadResponse {

    private String contentType;
    private String fileName;
    private byte[] file;

}
