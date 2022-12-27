-- migrate:up
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    profile_image VARCHAR(1000) NULL,
    PASSWORD VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NULL DEFAULT current_timestamp ON UPDATE current_timestamp
    
);

-- migrate:down
DROP TABLE users;