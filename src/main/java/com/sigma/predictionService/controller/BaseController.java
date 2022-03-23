package com.sigma.predictionService.controller;


import com.sigma.predictionService.model.User;
import com.sigma.predictionService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class BaseController {

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;
    @Autowired
    private UserService userService;

    @GetMapping("")
    public String getEmptyPage() {
        return "You are on / page";
    }

    @GetMapping("/success")
    public String getLoginInfo(Model model, OAuth2AuthenticationToken authentication) {

        OAuth2AuthorizedClient client;
        client = authorizedClientService
                .loadAuthorizedClient(
                        authentication.getAuthorizedClientRegistrationId(),
                        authentication.getName());


        return userService.saveUserInfo(authentication.getPrincipal().getAttributes());
    }

}
