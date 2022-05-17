package com.sigma.predictionService.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Data
@NoArgsConstructor
@Table(name = "refreshtoken")
public class RefreshToken {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    @Column(name = "expiryDate", nullable = false)
    private Instant expiryDate;
    //getters and setters

    @PreRemove
    private void preRemove() {
        user.setRefreshToken(null);
    }
}
