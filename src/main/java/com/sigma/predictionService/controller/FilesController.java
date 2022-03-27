package com.sigma.predictionService.controller;


import com.sigma.predictionService.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/file")
public class FilesController {

    final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/success")
    public String loadFile() {
        fileService.readScv("D:\\PredictionService\\pay2021-11-24.csv");

        return "done";
    }

}
