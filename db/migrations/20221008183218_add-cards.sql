-- migrate:up
create table card (
  id serial not null primary key,
  x int,
  y int,
  text text
);

-- migrate:down
drop table card;