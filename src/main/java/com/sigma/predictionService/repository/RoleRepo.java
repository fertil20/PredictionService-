package com.sigma.predictionService.repository;

import com.sigma.predictionService.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, String> {

    @Modifying
    @Query(nativeQuery = true, value = "DELETE from users_roles where role_name = :roleName")
    void deleteRolesAssociations(String roleName);
}
