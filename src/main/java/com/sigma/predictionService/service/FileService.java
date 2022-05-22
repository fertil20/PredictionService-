package com.sigma.predictionService.service;

import com.sigma.predictionService.dto.FileDownloadResponse;
import com.sigma.predictionService.dto.UserFilesResponse;
import com.sigma.predictionService.model.Files;
import com.sigma.predictionService.repository.FilesRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.supercsv.io.CsvListWriter;
import org.supercsv.io.ICsvListWriter;
import org.supercsv.prefs.CsvPreference;

import javax.validation.constraints.NotNull;
import java.io.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class FileService {
    final private LocalDateTimeFormatter localDateTimeFormatter;
    final private FilesRepo filesRepo;
    final private UserDetailsRepo userDetailsRepo;
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

    public FileService(LocalDateTimeFormatter localDateTimeFormatter,
                       FilesRepo filesRepo,
                       UserDetailsRepo userDetailsRepo) {
        this.localDateTimeFormatter = localDateTimeFormatter;
        this.filesRepo = filesRepo;
        this.userDetailsRepo = userDetailsRepo;
    }

    public Long uploadFile(@NotNull MultipartFile file, @NotNull Long id, @NotNull String dataType) throws IOException {
        if(Objects.equals(file.getContentType(),"text/csv") || Objects.equals(file.getContentType(), "application/vnd.ms-excel")){
            Files newFiles = new Files();
            newFiles.setFileName(file.getOriginalFilename());
            newFiles.setFile(file.getBytes());
            newFiles.setContentType(file.getContentType());
            newFiles.setDataType(dataType);
            newFiles.setCreateTime(LocalDateTime.now());
            newFiles.setUser(userDetailsRepo.getById(id));
            //if (verifyFileStructure(newFiles.getFile(), newFiles.getDataType()))
                var a = filesRepo.save(newFiles);
                logger.info("Successfully upload file with name - {}", newFiles.getFileName());
                return a.getId();
        }
        return null;
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


    public Map<String,Double> readCsv(Long fileId){
        Map<String, Double> answer = new LinkedHashMap<>();
        Files file = filesRepo.getById(fileId);
        InputStreamReader in = new InputStreamReader(new ByteArrayInputStream(file.getFile()));
        try {
            Iterable<CSVRecord>  records = CSVFormat.EXCEL.builder().setHeader(getHeaders(file.getDataType())).setSkipHeaderRecord(true).setDelimiter(';').build().parse(in);
            for (CSVRecord record : records) {
                String payDate = record.get("PAY_DATE");
                String pay = record.get("PAY").replace(',','.');
                answer.put(payDate,Double.valueOf(pay));

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return answer;
    }

    public Map<String,Double> getDataMapForDates(Long fileId ,String startDate, String endDate){
        Map<String,Double> rawMap = readCsv(fileId);
        Map<String,Double> filteredMap = new LinkedHashMap<>();
        boolean inRange = false;
        for (String key : rawMap.keySet()){
            if (Objects.equals(key,startDate) || inRange){
                filteredMap.put(key,rawMap.get(key));
                inRange = true;
                if (Objects.equals(key,endDate)){
                    inRange = false;
                }
            }
        }
        return filteredMap;
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

    public byte[] getFile(Long id){
            return filesRepo.getById(id).getFile();
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


    public void savePrediction(Map<String,Double> data, Long id, String dataType, String fileName){

        StringWriter output = new StringWriter();

        try (ICsvListWriter listWriter = new CsvListWriter(output,
                CsvPreference.EXCEL_NORTH_EUROPE_PREFERENCE)){
            listWriter.write("PAY", "PAY_DATE");//TODO переделать
            for (Map.Entry<String, Double> entry : data.entrySet()){
                listWriter.write(entry.getValue(), entry.getKey());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println(output);


        Files newFiles = new Files();
        newFiles.setFileName("PREDICTION_"+fileName);
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


    private String[] getHeaders(String dataType){
        String[] Headers;
        dataTypes type = dataTypes.valueOf(dataType);
        switch (type){
            case DATA_PAYMENTS:
                Headers = new String[] {" ", "PAY", "CNT","PAY_DATE"};
                break;
            case PREDICTION_PAYMENTS:
                Headers = new String[] {"PAY", "PAY_DATE"};
                break;
            default:
                Headers = null;
                break;
        }
        return Headers;
    }

    private boolean verifyFileStructure(byte[] fileToCheck, String dataType){
        boolean flag = false;
        String[] Headers = getHeaders(dataType);
        String[] RequirementHeaders = getHeaders(dataType);
        List<String> verifyHeaders = new ArrayList();
        InputStreamReader in = new InputStreamReader(new ByteArrayInputStream(fileToCheck));
        try {
            Iterable<CSVRecord>  records = CSVFormat.EXCEL.builder().setHeader(Headers).setDelimiter(';').build().parse(in);
            for (CSVRecord record : records) {
                for (String header: Headers){
                    var a = record.toMap().values().toArray(new String[0]);
                    List<String> recordHeaders = new ArrayList<String>( record.toMap().values());
                    if (!Arrays.asList(recordHeaders).contains(header))
                        return false;
                    //verifyHeaders.add(header);
                }
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    private enum dataTypes{
        DATA_PAYMENTS,
        PREDICTION_PAYMENTS
    }

}
