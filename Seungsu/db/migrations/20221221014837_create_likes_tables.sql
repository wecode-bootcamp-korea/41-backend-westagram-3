-- migrate:up
create table likes(
  id int not null auto_increment primary key,
  user_id int not null unique,
  post_id int not null,
  constraint likes_user_id_fkey foreign key (user_id) references users(id),
  constraint likes_post_id_fkey foreign key (post_id) references posts(id)
);

-- migrate:down
drop table likes;
