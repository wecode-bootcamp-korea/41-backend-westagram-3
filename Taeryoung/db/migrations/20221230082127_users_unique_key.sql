-- migrate:up
ALTER TABLE users ADD UNIQUE email_unique (email);

-- migrate:down

