CREATE TABLE IF NOT EXISTS users
(
    id       bigserial
    constraint users_pkey
    primary key,
    email    varchar(255) not null
    constraint uk6dotkott2kjsp8vw4d0m25fb7
    unique,
    name     varchar(255) not null,
    password varchar(255) not null,
    username varchar(255) not null
    constraint ukr43af9ap4edm43mmtq01oddj6
    unique
    );

CREATE TABLE IF NOT EXISTS roles
(
    name       varchar(60) not null
    constraint roles_pkey
    primary key,
    privileges varchar(255)
    );


CREATE TABLE IF NOT EXISTS users_roles
(
    user_id   bigint      not null
    constraint fk2o0jvgh89lemvvo17cbqvdxaa
    references users,
    role_name varchar(60) not null
    constraint fkfddtbwrqg5sal9y57yyol7579
    references roles,
    constraint users_roles_pkey
    primary key (user_id, role_name)
    );


CREATE TABLE IF NOT EXISTS files (
                                     id bigserial constraint files_pkey primary key,
                                     content_type varchar(255) not null,
    create_time  timestamp    not null,
    data_type    varchar(255) not null,
    file         oid,
    file_name    varchar(255) not null,
    user_id      bigint
    constraint fkdgr5hx49828s5vhjo1s8q3wdp
    references users
    );


CREATE TABLE IF NOT EXISTS payment
(
    id    bigint       not null
    constraint payment_pkey
    primary key,
    count varchar(255) not null,
    date  timestamp    not null,
    pay   varchar(255) not null
    );



