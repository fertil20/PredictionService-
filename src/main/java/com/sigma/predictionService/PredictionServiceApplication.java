package com.sigma.predictionService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@SpringBootApplication
public class PredictionServiceApplication {

	public static class Profiles {
		public static final String LOCAL = "local";
	}


	@Bean
	public ExecutorService executorService() {
		return Executors.newCachedThreadPool();
	}

	public static void main(String[] args) {
		SpringApplication.run(PredictionServiceApplication.class, args);
	}


}


