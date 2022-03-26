package com.sigma.predictionService.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "file")
@Data
@NoArgsConstructor
public class File {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Column(name = "pay", nullable = false)
    private String pay;

    @Column(name = "count", nullable=false)
    private String count;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @OneToMany (mappedBy = "files")
    @EqualsAndHashCode.Exclude
    private Set<Payment> payments;


    @ManyToOne
    @EqualsAndHashCode.Exclude
    private User user;
}
