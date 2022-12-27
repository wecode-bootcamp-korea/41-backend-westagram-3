-- migrate:up
CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(50) NOT NULL,
  email varchar(200) NOT NULL,
  profile_image varchar(1000) DEFAULT NULL,
  password varchar(200) NOT NULL,
  age INT NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT email_constraint UNIQUE (email)
);

-- migrate:down
DROP TABLE users;
