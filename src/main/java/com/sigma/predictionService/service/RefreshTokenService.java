package com.sigma.predictionService.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import com.sigma.predictionService.exception.TokenRefreshException;
import com.sigma.predictionService.model.RefreshToken;
import com.sigma.predictionService.repository.RefreshTokenRepo;
import com.sigma.predictionService.repository.UserDetailsRepo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {
    @Value("${app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepo refreshTokenRepository;

    private final UserDetailsRepo userRepository;

    public RefreshTokenService(RefreshTokenRepo refreshTokenRepository, UserDetailsRepo userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }


    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public Optional<RefreshToken> findById(Long id) {
        return refreshTokenRepository.findById(id);
    }

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshTokenRepository.deleteById(userId);
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        return 0; //TODO не знаю почему не могу заставить работать
    }
}
