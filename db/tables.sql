use `COMS6156-contacts-db`;

CREATE TABLE Email (
    email VARCHAR(128) NOT NULL,
    verified TINYINT NOT NULL DEFAULT 0, 
    uid INT NOT NULL,
    UNIQUE(uid),
    PRIMARY KEY(email)
);

CREATE TABLE Phone (
    phone_number VARCHAR(16) NOT NULL,
    verified TINYINT NOT NULL DEFAULT 0, 
    uid INT NOT NULL,
    UNIQUE(uid),
    PRIMARY KEY(phone_number)
);

CREATE TABLE ZipCode (
    zip_code VARCHAR(5) NOT NULL,
    verified TINYINT NOT NULL DEFAULT 0, 
    uid INT NOT NULL,
    UNIQUE(uid),
    PRIMARY KEY(zip_code)
);