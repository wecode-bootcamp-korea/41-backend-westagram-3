-- migrate:up
create table posts(
  id int not null auto_increment primary key,
  title varchar(100) not null,
  content varchar(2000) not null,
  user_id int not null, 
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp on update current_timestamp,
  constraint posts_user_id_fkey foreign key (user_id) references users(id)
)

-- migrate:down
drop table posts;
