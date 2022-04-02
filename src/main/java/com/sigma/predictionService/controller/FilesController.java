package com.sigma.predictionService.controller;


import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/file")
public class FilesController {

    final FileService fileService;

    public FilesController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload/{id}")
    public void uploadFile(@RequestParam("file") MultipartFile file, @PathVariable Long id) throws IOException {
        if (file!= null && id!=null){
            fileService.uploadFile(file, id);
        }
    }

    @GetMapping("/parse/{id}")
    public void parseFile(@PathVariable Long id){
            fileService.readScv(id);
    }

}
