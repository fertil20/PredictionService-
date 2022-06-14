package com.sigma.predictionService.repository;

import com.sigma.predictionService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface UserDetailsRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);


    @Modifying
    @Query(nativeQuery = true, value = "DELETE from files where user_id = :id")
    void deleteFilesAssociations(Long id);

}
