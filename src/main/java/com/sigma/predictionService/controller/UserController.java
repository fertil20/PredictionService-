package com.sigma.predictionService.controller;

import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.service.FileService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FileService fileService;

    public UserController(FileService fileService) {
        this.fileService = fileService;
    }

    @Transactional
    @GetMapping("/{id}/files")
    public List<UserFilesResponse> getUserFiles(@PathVariable Long id){
        return fileService.getUserFiles(id);
    }
}
