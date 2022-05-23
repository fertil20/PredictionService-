package com.sigma.predictionService.service;

import com.sigma.predictionService.model.Files;
import com.sigma.predictionService.repository.FilesRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.hibernate.service.spi.ServiceException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.validation.constraints.NotNull;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class PredictionService {
    private final WebClient client;
    private final HttpClient httpClient;
    final private FilesRepo filesRepo;
    final private UserDetailsRepo userDetailsRepo;
    final private FileService fileService;

    public PredictionService(FilesRepo filesRepo, UserDetailsRepo userDetailsRepo, FileService fileService) {
        this.filesRepo = filesRepo;
        this.userDetailsRepo = userDetailsRepo;
        this.fileService = fileService;

        httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 60000)
                .responseTimeout(Duration.ofMillis(60000))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(60000, TimeUnit.MILLISECONDS))
                                .addHandlerLast(new WriteTimeoutHandler(60000, TimeUnit.MILLISECONDS)));

        client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl("http://localhost:5000")
                .defaultCookie("cookieKey", "cookieValue")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", "http://localhost:5000"))
                .build();

    }


    public Map<String, Map<String, Double>> getPrediction(@NotNull Long id,
                                                          @NotNull Long userId,
                                                          @NotNull String startDate,
                                                          @NotNull String endDate,
                                                          @NotNull Integer peak
    ){
        Map<String, Double> predictionPesponce = new LinkedHashMap<>();
        Map<String, Double> dataPesponce = new LinkedHashMap<>();
        Map<String, Map<String, Double>> resultMap = new LinkedHashMap<>();

        Files file = filesRepo.getById(id);
        if (Objects.equals(file.getUser().getId(), userId)) {

            String fileHeader = String.format("form-data; name=%s; filename=%s", "file", file.getFileName());
            String startDateHeader = String.format("form-data; name=%s", "start_date");
            String endDateHeader = String.format("form-data; name=%s", "end_date");
            String peakHeader = String.format("form-data; name=%s", "enter_pick");

            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", new ByteArrayResource(file.getFile())).header("Content-Disposition", fileHeader);
            builder.part("start_date", startDate).header("Content-Disposition", startDateHeader);
            builder.part("end_date", endDate).header("Content-Disposition", endDateHeader);
            builder.part("end_date", peak).header("Content-Disposition", peakHeader);

            predictionPesponce = client
                    .post()
                    .uri("/prediction/payment")
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .exchangeToMono(response -> {
                        if (response.statusCode().equals(HttpStatus.OK)) {
                            return response.bodyToMono(Map.class);
                        } else {
                            throw new ServiceException("Error uploading file");
                        }
                    })
                    .block();
            //System.out.println(predictionPesponce);
        }

        dataPesponce = fileService.getDataMapForDates(id, startDate, endDate);
        //System.out.println(dataPesponce);
        resultMap.put("DATA", dataPesponce);
        resultMap.put("PREDICTION", predictionPesponce);
        return resultMap;
    }

}
