package com.sigma.predictionService.controller;

import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import com.sigma.predictionService.service.PredictionService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }



    @PostMapping("/predict/{id}")
    public void getPrediction(@PathVariable Long id,
                              @CurrentUser UserPrincipal currentUser) throws IOException {
        predictionService.getPrediction(id, currentUser.getId());

    }

}
