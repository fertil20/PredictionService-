package com.sigma.predictionService.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
public class Payment {

    @Id
    @Column(name = "id", nullable = false)
    private Long fileId;

    @Column(name = "pay", nullable = false)
    private String pay;

    @Column(name = "count", nullable=false)
    private String count;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    private File files;
}
