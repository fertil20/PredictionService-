package com.sigma.predictionService.controller;

import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import com.sigma.predictionService.service.PredictionService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;

@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }


    @Transactional
    @GetMapping("/predict/{id}")
    public HashMap<String, Float> getPrediction(@PathVariable Long id,
                                 @CurrentUser UserPrincipal currentUser){
        return predictionService.getPrediction(id, currentUser.getId());
    }

}
