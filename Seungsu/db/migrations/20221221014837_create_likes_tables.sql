-- migrate:up
create table likes(
  id int not null auto_increment primary key,
  user_id int not null,
  post_id int not null,
  constraint likes_user_id_fkey foreign key (user_id) references users(id),
  constraint likes_post_id_fkey foreign key (post_id) references posts(id),
  constraint likes_unique unique (user_id, post_id)
);

-- migrate:down
drop table likes;
