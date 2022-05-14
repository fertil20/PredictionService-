CREATE TABLE IF NOT EXISTS refreshtoken
(
    user_id     BIGINT                      NOT NULL,
    token       VARCHAR(255)                NOT NULL,
    expiry_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_refreshtoken PRIMARY KEY (user_id)
);

ALTER TABLE refreshtoken
    ADD CONSTRAINT uc_refreshtoken_token UNIQUE (token);

ALTER TABLE refreshtoken
    ADD CONSTRAINT FK_REFRESHTOKEN_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);
