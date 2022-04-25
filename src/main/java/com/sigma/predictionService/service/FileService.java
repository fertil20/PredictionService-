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
import org.supercsv.io.CsvListWriter;
import org.supercsv.io.ICsvListWriter;
import org.supercsv.prefs.CsvPreference;

import javax.validation.constraints.NotNull;
import java.io.*;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
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
        if(Objects.equals(file.getContentType(),"text/csv") || Objects.equals(file.getContentType(), "application/vnd.ms-excel")){
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
            return filesRepo.findFilesByUserIdAndDataType(id, dataType)
                    .stream()
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

    public void savePrediction(Map<String,Double> data, Long id, String dataType){

        StringWriter output = new StringWriter();

        try (ICsvListWriter listWriter = new CsvListWriter(output,
                CsvPreference.EXCEL_NORTH_EUROPE_PREFERENCE)){
            listWriter.write("PAY", "PAY_DATE");
            for (Map.Entry<String, Double> entry : data.entrySet()){
                listWriter.write(entry.getValue(), entry.getKey());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(output);


        Files newFiles = new Files();
        newFiles.setFileName("TempName");
        newFiles.setContentType("text/csv");
        newFiles.setDataType(dataType);
        newFiles.setCreateTime(LocalDateTime.now());
        newFiles.setUser(userDetailsRepo.getById(id));
        newFiles.setFile(output.toString().getBytes());

        filesRepo.save(newFiles);



        /*
        String[] header = data.keySet().toArray(new String[data.size()]);
        Double[] dataSetDouble = data.values().toArray(new Double[data.size()]);
        String[] dataSet = new String[dataSetDouble.length];
        for (int i = 0; i < dataSetDouble.length; i++)
            dataSet[i] = String.valueOf(dataSetDouble[i]);




//using custom delimiter and quote character
        CSVWriter csvWriter = new CSVWriter(output,
                                    '#',
                                    '\n',
                                    CSVWriter.DEFAULT_ESCAPE_CHARACTER,
                                    CSVWriter.DEFAULT_LINE_END);
        for (Map.Entry<String, Double> entry : data.entrySet()){
            csvWriter.write(entry.getKey(), String.valueOf(entry.getValue()));
        }
        writer.writeNext(header);
        writer.writeNext(dataSet);



        StringBuilder builder = new StringBuilder();
        builder.append(";PAY;");
        builder.append("PAY_DATE");
        builder.append("\r\n");
        var i = 1;
        for (Map.Entry<String, Double> kvp : data.entrySet()) {
            builder.append(i)
                    .append(";")
                    .append(kvp.getValue());
            builder.append(";");
            builder.append(kvp.getKey());
            builder.append("\r\n");
        }

 */
    }



    public void deleteFile(Long id){
        filesRepo.deleteById(id);
    }

}
