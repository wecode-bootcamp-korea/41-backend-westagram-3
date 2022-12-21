-- migrate:up
CREATE TABLE posts(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(100) NOT NULL,
    content varchar(3000) DEFAULT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down
DROP TABLE posts;
