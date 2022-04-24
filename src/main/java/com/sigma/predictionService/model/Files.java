package com.sigma.predictionService.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "files")
@Data
@NoArgsConstructor
public class Files {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "fileName", nullable = false)
    private String fileName;

    @Column(name = "contentType", nullable = false)
    private String contentType;

    @Column(name = "createTime", nullable = false)
    private LocalDateTime createTime;

    @Column(name = "dataType", nullable = false)
    private String dataType;

    @Column(name = "file")
    @Lob
    private byte[] file;

    @ManyToOne
    @EqualsAndHashCode.Exclude
    private User user;
}
