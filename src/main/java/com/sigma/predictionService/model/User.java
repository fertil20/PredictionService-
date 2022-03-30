package com.sigma.predictionService.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;


@Entity
@Table(name = "users", uniqueConstraints = {
@UniqueConstraint(columnNames = {
        "username"
}),
@UniqueConstraint(columnNames = {
        "email"
})
})
@Data
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "username", nullable=false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable=false)
    private String password;
    @ManyToMany
    @JoinTable(name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_name"))
    @EqualsAndHashCode.Exclude
    private Set<Role> roles;

    @OneToMany (mappedBy = "user")
    @EqualsAndHashCode.Exclude
    private Set<Files> files;

}