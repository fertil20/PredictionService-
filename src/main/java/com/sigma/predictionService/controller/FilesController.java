package com.sigma.predictionService.controller;


import com.sigma.predictionService.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("/api/file")
public class FilesController {

    final FileService fileService;


    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public void uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file!= null && !Objects.requireNonNull(file.getOriginalFilename()).isEmpty()){
            fileService.uploadFile(file);
        }
    }

    @PostMapping("/parse")
    public void parseFile(@RequestParam("fileName") String fileName){
        if (fileName!=null){

        }
    }

    @GetMapping("/success")//NOT USE
    public String loadFile() {
        fileService.readScv("D:\\PredictionService\\pay2021-11-24.csv");

        return "done";
    }

}
