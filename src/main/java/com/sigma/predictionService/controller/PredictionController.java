package com.sigma.predictionService.controller;

import com.sigma.predictionService.security.CurrentUser;
import com.sigma.predictionService.security.UserPrincipal;
import com.sigma.predictionService.service.PredictionService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }


    @Transactional
    @GetMapping("/predict/{id}")
    public Map<String, Map<String, Double>> getPrediction(@PathVariable Long id,
                                                          @CurrentUser UserPrincipal currentUser,
                                                          @RequestParam String startDate,
                                                          @RequestParam String endDate,
                                                          @RequestParam Integer peak){
        return predictionService.getPrediction(id, currentUser.getId(), startDate, endDate, peak);
    }

}
