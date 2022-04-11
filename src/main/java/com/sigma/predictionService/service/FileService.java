package com.sigma.predictionService.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.model.Files;
import com.sigma.predictionService.repository.FilesRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
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


    public void readScv(Long fileId){
        Files file = filesRepo.getById(fileId);
        try(CSVReader reader = new CSVReader(
                                new InputStreamReader(
                                    new ByteArrayInputStream(file.getFile())))){
            List<String[]> r = reader.readAll();
            r.forEach(x -> System.out.println(Arrays.toString(x)));
        } catch (IOException | CsvException e) {
            e.printStackTrace();
        }
    }

    public void changeFileName(Long id, String name){
        Files updatedFile = filesRepo.getById(id);
        updatedFile.setFileName(name);
        filesRepo.save(updatedFile);
    }

    public byte[] getFile(Long id, Long userId){
        Files file = filesRepo.getById(id);
        if (Objects.equals(file.getUser().getId(), userId)){
            return file.getFile();
        }
        return null;
    }

    public void deleteFile(Long id){
        filesRepo.deleteById(id);
    }

}
