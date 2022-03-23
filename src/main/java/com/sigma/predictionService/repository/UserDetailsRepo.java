package com.sigma.predictionService.repository;

import com.sigma.predictionService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;



public interface UserDetailsRepo extends JpaRepository<User, String> {
}
