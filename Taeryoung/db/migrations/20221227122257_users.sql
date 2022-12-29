-- migrate:up
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    profileImage VARCHAR(2000) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NULL DEFAULT current_timestamp ON UPDATE current_timestamp
);

-- migrate:down
DROP TABLE users;