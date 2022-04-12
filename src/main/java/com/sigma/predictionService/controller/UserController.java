package com.sigma.predictionService.controller;

import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.model.User;
import com.sigma.predictionService.repository.RoleRepo;
import com.sigma.predictionService.service.CustomUserDetailsService;
import com.sigma.predictionService.service.FileService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {



    private final FileService fileService;
    private final CustomUserDetailsService customUserDetailsService;

    public UserController(FileService fileService,
                          RoleRepo roleRepo,
                          CustomUserDetailsService customUserDetailsService) {
        this.fileService = fileService;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Transactional
    @GetMapping("/{id}/files")
    public List<UserFilesResponse> getUserFiles(@PathVariable Long id){
        return fileService.getUserFiles(id);
    }

    @Transactional
    @PostMapping("/new")
    @PreAuthorize("hasAuthority('Manage_Users')")
    public void createUserProfile(@RequestBody User request) throws MessagingException, UnsupportedEncodingException {
        customUserDetailsService.createNewUser(request);
    }
}
