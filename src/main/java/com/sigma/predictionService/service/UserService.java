package com.sigma.predictionService.service;


import com.sigma.predictionService.dto.ProfileEditRequest;
import com.sigma.predictionService.dto.UserProfile;
import com.sigma.predictionService.exception.ResourceNotFoundException;
import com.sigma.predictionService.model.Role;
import com.sigma.predictionService.model.User;
import com.sigma.predictionService.repository.RoleRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.constraints.NotNull;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class UserService {

    private final UserDetailsRepo userDetailsRepo;
    private final RoleRepo roleRepo;
    public final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;


    public UserService(UserDetailsRepo userDetailsRepo,
                       PasswordEncoder passwordEncoder,
                       RoleRepo roleRepo,
                       JavaMailSender mailSender
    ) {
        this.userDetailsRepo = userDetailsRepo;
        this.passwordEncoder = passwordEncoder;
        this.roleRepo = roleRepo;
        this.mailSender = mailSender;
    }


    @Transactional
    public void createNewUser(User request) {
        User user = new User();
        String username = request.getUsername();
        String password = new SecureRandom()
                .ints(8, '!', '{')
                .mapToObj(i -> String.valueOf((char) i))
                .collect(Collectors.joining());

        String email = request.getEmail();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setName(request.getName());
        Role role = roleRepo.getById("????????????????????????");
        user.setRoles(Collections.singleton(role));
        userDetailsRepo.save(user);

        try {
            sendEmail(email, password, username);
        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }

    }

    public void sendEmail(String recipientEmail, String password, String username)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom("workspace.app.8371@gmail.com", "PredictionSigma Support");//TODO ?????????????? ????????
        helper.setTo(recipientEmail);

        String subject = "?????????? ???????????????????? ?? ??????????????!";
        String content = "<p>?????????? ????????????????????!</p>"
                + "<p>???? ???????? ???????????????????????????????? ?? ?????????????? ?? ???????????? ???????????? ?????????????? ?? ?????? ???? ????????????:</p>"
                + "<p><a href=\"http://localhost:3000/\">?????????????? ?? ??????????????</a></p>"
                + "<p>?????? ??????????: " + username + "</p>"
                + "<p>?????? ????????????: " + password + "</p>";

        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }

    @Transactional
    public void editProfile(@CurrentUser UserPrincipal currentUser,
                            String username,
                            ProfileEditRequest request) {
        User user = userDetailsRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        String currentUsername = currentUser.getUsername();
        Set<String> currentUserPrivileges = currentUser.getPrivileges();

        if (!currentUsername.equals(username) && !currentUserPrivileges.contains("Edit_Users")) {
            throw new AccessDeniedException("?? ?????? ?????? ???????? ?????? ???????????????????????????? ???????????? ??????????????????????????");
        }
        user.setEmail(request.getEmail());
        if (currentUserPrivileges.contains("Edit_Users")) {
            user.setName(request.getName());
        }
        userDetailsRepo.save(user);
    }

    public UserProfile getUserProfile(@NotNull String username, @NotNull UserPrincipal currentUser) {
        User user = userDetailsRepo.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getEmail());
    }

}