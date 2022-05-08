CREATE TABLE IF NOT EXISTS refreshtoken
(
    id          BIGINT                      NOT NULL,
    user_id     BIGINT,
    token       VARCHAR(255)                NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_refreshtoken PRIMARY KEY (id)
);
