package com.sigma.predictionService.repository;

import com.sigma.predictionService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserDetailsRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsernameOrEmail(String username, String email);


}
