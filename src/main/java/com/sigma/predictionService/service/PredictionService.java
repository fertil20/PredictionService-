package com.sigma.predictionService.service;

import com.sigma.predictionService.model.Files;
import com.sigma.predictionService.repository.FilesRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.hibernate.service.spi.ServiceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import javax.validation.constraints.NotNull;
import java.io.IOException;
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
                        conn.addHandlerLast(new ReadTimeoutHandler(5000, TimeUnit.MILLISECONDS))
                                .addHandlerLast(new WriteTimeoutHandler(5000, TimeUnit.MILLISECONDS)));

        client = WebClient.builder()
                .baseUrl("http://127.0.0.1:5000")
                .defaultCookie("cookieKey", "cookieValue")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", "http://127.0.0.1:5000"))
                .build();

    }


    public void getPrediction(@NotNull Long id,
                              @NotNull Long userId) throws IOException {
        Files file = filesRepo.getById(id);
        if (Objects.equals(file.getUser().getId(), userId)) {
            MultipartBodyBuilder builder = new MultipartBodyBuilder();
            builder.part("file", file.getFile());

            Mono<HttpStatus> httpStatusMono = client.post()
                    .uri("/getpred")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(builder.build()))
                    .exchangeToMono(response -> {
                        if (response.statusCode().equals(HttpStatus.OK)) {
                            return response.bodyToMono(HttpStatus.class).thenReturn(response.statusCode());
                        } else {
                            throw new ServiceException("Error uploading file");
                        }
                    });
        }
    }

}
