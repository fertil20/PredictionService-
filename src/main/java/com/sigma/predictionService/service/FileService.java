package com.sigma.predictionService.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.model.Files;
import com.sigma.predictionService.repository.FilesRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.io.FileReader;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class FileService {

    final private FilesRepo filesRepo;
    final private UserDetailsRepo userDetailsRepo;

    public FileService(FilesRepo filesRepo, UserDetailsRepo userDetailsRepo) {
        this.filesRepo = filesRepo;
        this.userDetailsRepo = userDetailsRepo;
    }

    public void uploadFile(@NotNull MultipartFile file, @NotNull Long id) throws IOException {

        Files newFiles = new Files();
        newFiles.setFileName(file.getOriginalFilename());
        newFiles.setFile(file.getBytes());
        newFiles.setUser(userDetailsRepo.getById(id));
        filesRepo.save(newFiles);
    }

    public List<UserFilesResponse> getUserFiles(@NotNull Long id){
            return filesRepo.findFilesByUserId(id).stream().map(files ->
                    new UserFilesResponse(
                            files.getId(),
                            files.getFileName()//TODO сам файл?
                    )).collect(Collectors.toList());
    }


    public void readScv(String fileName){
        try (CSVReader reader = new CSVReader(new FileReader(fileName))) {
            List<String[]> r = reader.readAll();
            r.forEach(x -> System.out.println(Arrays.toString(x)));
        } catch (IOException | CsvException e) {
            e.printStackTrace();
        }

    }

}
