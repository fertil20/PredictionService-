package com.sigma.predictionService.controller;

import com.sigma.predictionService.dto.UserIdentityAvailability;
import com.sigma.predictionService.dto.UserSummary;
import com.sigma.predictionService.repository.UserDetailsRepo;
import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class ApiController {

    private final UserDetailsRepo userDetailsRepo;

    public ApiController(UserDetailsRepo userDetailsRepo) {
        this.userDetailsRepo = userDetailsRepo;
    }


    @GetMapping("/me")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        return new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName(), currentUser.getPrivileges());
    }

    @GetMapping("/auth/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userDetailsRepo.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/auth/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userDetailsRepo.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }
}
