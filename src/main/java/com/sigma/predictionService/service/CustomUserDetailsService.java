package com.sigma.predictionService.service;

import com.sigma.predictionService.exception.ResourceNotFoundException;
import com.sigma.predictionService.model.User;
import com.sigma.predictionService.repository.UserDetailsRepo;
import com.sigma.predictionService.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDetailsRepo userDetailsRepo;

    public CustomUserDetailsService(UserDetailsRepo userDetailsRepo) {
        this.userDetailsRepo = userDetailsRepo;
    }

    /*
    public String saveUserInfo(Map<String, Object> attributes) {
        String id = (String) attributes.get("sub");
        User user = userDetailsRepo.findById(id).orElseGet(() -> {
            User newUser = new User();

            newUser.setId((String) attributes.get("sub"));
            newUser.setEmail((String) attributes.get("email"));
            newUser.setGender((String) attributes.get("gender"));
            newUser.setLocale((String) attributes.get("locale"));
            newUser.setUserpic((String) attributes.get("picture"));
            newUser.setName((String) attributes.get("name"));
            newUser.setLastVisit(LocalDateTime.now());

            return newUser;
        });
        userDetailsRepo.save(user);
        return userDetailsRepo.save(user).toString();

    }
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail)
            throws UsernameNotFoundException {
        // Let people login with either username or email
        User user = userDetailsRepo.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with username or email : " + usernameOrEmail)
                );

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userDetailsRepo.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );

        return UserPrincipal.create(user);
    }
}