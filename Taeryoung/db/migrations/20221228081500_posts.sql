-- migrate:up
CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    imageUrl VARCHAR(2000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp,
    CONSTRAINT created_posts_create_users FOREIGN KEY (user_id) REFERENCES users (id)
)

-- migrate:down
DROP TABLE posts;