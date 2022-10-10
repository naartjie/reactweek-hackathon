-- migrate:up
alter table
  card
add
  column title text default '',
add
  column z_index int default 1;

-- migrate:down