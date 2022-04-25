package com.sigma.predictionService.repository;

import com.sigma.predictionService.model.Files;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface FilesRepo extends JpaRepository<Files, Long> {

    Set<Files> findFilesByUserId(Long id);

    Set<Files> findFilesByUserIdAndDataType(Long id, String dataType);
}
