-- migrate:up
create table users (
  id int not null auto_increment primary key,
  name varchar(50) not null,
  email varchar(100) not null unique,
  password varchar(100) not null,
  profile_image varchar(100) not null,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp ON UPDATE current_timestamp
);

-- migrate:down
drop table users;
