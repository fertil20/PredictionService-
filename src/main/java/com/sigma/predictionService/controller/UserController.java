package com.sigma.predictionService.controller;

import com.sigma.predictionService.dto.ProfileEditRequest;
import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.dto.UserForListResponse;
import com.sigma.predictionService.dto.UserProfile;
import com.sigma.predictionService.exception.ResourceNotFoundException;
import com.sigma.predictionService.model.User;
import com.sigma.predictionService.repository.RoleRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import com.sigma.predictionService.service.CustomUserDetailsService;
import com.sigma.predictionService.service.FileService;
import com.sigma.predictionService.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/users")
public class UserController {


    private final UserDetailsRepo userDetailsRepo;
    private final FileService fileService;
    private final UserService userService;

    public UserController(FileService fileService,
                          UserService userService,
                          UserDetailsRepo userDetailsRepo) {
        this.fileService = fileService;
        this.userService = userService;
        this.userDetailsRepo = userDetailsRepo;
    }

    @GetMapping
    public List<UserForListResponse> getAllUsers() {
        return userDetailsRepo.findAll().stream()
                .map(user -> new UserForListResponse(user.getId(), user.getUsername(), user.getName(), user.getEmail()))
                .collect(Collectors.toList());
    }

    @Transactional
    @GetMapping("/{id}/files")
    public List<UserFilesResponse> getUserFiles(@PathVariable Long id, @RequestParam String dataType){
        return fileService.getUserFiles(id, dataType);
    }

    @Transactional
    @PostMapping("/new")
    @PreAuthorize("hasAuthority('Manage_Users')")
    public void createUserProfile(@RequestBody User request) throws MessagingException, UnsupportedEncodingException {
        userService.createNewUser(request);
    }

    @PostMapping("/{username}/edit")
    public void editUserProfile(@PathVariable(value = "username") String username,
                                @CurrentUser UserPrincipal currentUser,
                                @RequestBody ProfileEditRequest request) {
        userService.editProfile(currentUser, username, request);
    }

    @GetMapping("/{username}")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username, @CurrentUser UserPrincipal currentUser){
        if (Objects.nonNull(username) && Objects.nonNull(currentUser)){
            return userService.getUserProfile(username, currentUser);
        }
        else return null;
    }

    @PostMapping("/{id}/deleteUser")
    @Transactional
    @PreAuthorize("hasAuthority('Manage_Users')")
    public void deleteUser(@PathVariable(value = "id") Long id) {
        userDetailsRepo.deleteFilesAssociations(id);
        userDetailsRepo.deleteById(id);
    }
}
