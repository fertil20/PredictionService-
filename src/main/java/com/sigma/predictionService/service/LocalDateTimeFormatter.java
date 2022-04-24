package com.sigma.predictionService.service;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class LocalDateTimeFormatter {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    public String formatDateTime(LocalDateTime localDateTime){
        return localDateTime.format(formatter);
    }
}
