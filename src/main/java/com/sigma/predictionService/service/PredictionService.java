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
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.Duration;
import java.util.Collections;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
public class PredictionService {
    private final WebClient client;
    private final HttpClient httpClient;
    final private FilesRepo filesRepo;
    final private UserDetailsRepo userDetailsRepo;

    public PredictionService(FilesRepo filesRepo, UserDetailsRepo userDetailsRepo) {
        this.filesRepo = filesRepo;
        this.userDetailsRepo = userDetailsRepo;

        httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                .responseTimeout(Duration.ofMillis(5000))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(15000, TimeUnit.MILLISECONDS))
                                .addHandlerLast(new WriteTimeoutHandler(15000, TimeUnit.MILLISECONDS)));

        client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl("http://localhost:5000")
                .defaultCookie("cookieKey", "cookieValue")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", "http://localhost:5000"))
                .build();

    }


    public void getPrediction(@NotNull Long id,
                              @NotNull Long userId) throws IOException {
        Files file = filesRepo.getById(id);
        if (Objects.equals(file.getUser().getId(), userId)) {
            String header1 = String.format("form-data; name=%s; filename=%s", "file", file.getFileName());
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", new ByteArrayResource(file.getFile())).header("Content-Disposition", header1);

            String httpStatusMono = client
                    .post()
                    .uri("/prediction/payment")
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .exchangeToMono(response -> {
                        if (response.statusCode().equals(HttpStatus.OK)) {
                            return response.bodyToMono(String.class);
                        } else {
                            throw new ServiceException("Error uploading file");
                        }
                    })
                    .block();
                    ;
            System.out.println(httpStatusMono);
        }
    }

}
