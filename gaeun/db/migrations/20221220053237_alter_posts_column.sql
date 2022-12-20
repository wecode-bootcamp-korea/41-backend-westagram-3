-- migrate:up
ALTER TABLE posts MODIFY post_image VARCHAR(1000) NOT NULL;
-- migrate:down

