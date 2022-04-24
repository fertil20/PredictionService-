package com.sigma.predictionService.service;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import com.sigma.predictionService.dto.FileDownloadResponse;
import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.model.Files;
import com.sigma.predictionService.repository.FilesRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotNull;
import java.io.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class FileService {
    final private LocalDateTimeFormatter localDateTimeFormatter;
    final private FilesRepo filesRepo;
    final private UserDetailsRepo userDetailsRepo;

    public FileService(LocalDateTimeFormatter localDateTimeFormatter,
                       FilesRepo filesRepo,
                       UserDetailsRepo userDetailsRepo) {
        this.localDateTimeFormatter = localDateTimeFormatter;
        this.filesRepo = filesRepo;
        this.userDetailsRepo = userDetailsRepo;
    }

    public void uploadFile(@NotNull MultipartFile file, @NotNull Long id, @NotNull String dataType) throws IOException {
        if(Objects.equals(file.getContentType(),"text/csv")){
            Files newFiles = new Files();
            newFiles.setFileName(file.getOriginalFilename());
            newFiles.setFile(file.getBytes());
            newFiles.setContentType(file.getContentType());
            newFiles.setDataType(dataType);
            newFiles.setCreateTime(LocalDateTime.now());
            newFiles.setUser(userDetailsRepo.getById(id));

            filesRepo.save(newFiles);
        }
    }

    public List<UserFilesResponse> getUserFiles(@NotNull Long id, @NotNull String dataType){
            return filesRepo.findFilesByUserId(id)
                    .stream()
                    .filter(file ->  Objects.equals(file.getDataType(), dataType))
                    .map(files ->
                    new UserFilesResponse(
                            files.getId(),
                            files.getFileName(),
                            localDateTimeFormatter.formatDateTime(files.getCreateTime())
                    ))
                    .collect(Collectors.toList());
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

    public FileDownloadResponse getDownloadFile(Long id, Long userId){
        FileDownloadResponse response = new FileDownloadResponse();
        Files file = filesRepo.getById(id);
        if (Objects.equals(file.getUser().getId(), userId)){
            response.setFile(file.getFile());
            response.setFileName(file.getFileName());
            response.setContentType(file.getContentType());
            return response;
        }
        return null;
    }

    public void deleteFile(Long id){
        filesRepo.deleteById(id);
    }

}
