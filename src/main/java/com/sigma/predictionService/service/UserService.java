package com.sigma.predictionService.service;

import com.sigma.predictionService.model.User;
import com.sigma.predictionService.repository.UserDetailsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;


@Service
public class UserService {
    @Autowired
    UserDetailsRepo userDetailsRepo;

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


}