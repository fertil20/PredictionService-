package com.sigma.predictionService.service;

import com.sigma.predictionService.exception.ResourceNotFoundException;
import com.sigma.predictionService.model.Role;
import com.sigma.predictionService.model.User;
import com.sigma.predictionService.repository.RoleRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import com.sigma.predictionService.security.UserPrincipal;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.stream.Collectors;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDetailsRepo userDetailsRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;


    public CustomUserDetailsService(UserDetailsRepo userDetailsRepo,
                                    PasswordEncoder passwordEncoder, RoleRepo roleRepo,
                                    JavaMailSender mailSender) {
        this.userDetailsRepo = userDetailsRepo;
        this.passwordEncoder = passwordEncoder;
        this.roleRepo = roleRepo;
        this.mailSender = mailSender;
    }

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

    @Transactional
    public void createNewUser(User request){
        User user = new User();
        String username = request.getUsername();
        String password = new SecureRandom()
                .ints(8, '!', '{')
                .mapToObj(i -> String.valueOf((char)i))
                .collect(Collectors.joining());

        String email = request.getEmail();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setName(request.getName());
        Role role = roleRepo.getById("Пользователь");
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

        helper.setFrom("", "PredictionSigma Support");//TODO СДЕЛАТЬ МЫЛО
        helper.setTo(recipientEmail);

        String subject = "Добро пожаловать в систему!";
        String content = "<p>Добро пожаловать!</p>"
                + "<p>Вы были зарегистрированы в системе и теперь можете перейти к ней по ссылке:</p>"
                + "<p><a href=\"https://my-workspace.ml/\">Перейти к системе</a></p>"
                + "<p>Ваш логин: " + username + "</p>"
                + "<p>Ваш пароль: " + password + "</p>";

        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }
}