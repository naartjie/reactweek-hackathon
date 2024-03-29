-- migrate:up
create or replace function notify_card_updated ()
  returns trigger
  language plpgsql
as $$ 
declare
  channel text := tg_argv[0];
  id bigint;


begin 

if tg_op = 'INSERT' or tg_op = 'UPDATE' then
  id = new.id;
else
  id = old.id;
end if;


perform (
  with payload(id, x, y, z_index, title, text) as (
    select
      id,
      new.x,
      new.y,
      new.z_index,
      new.title,
      new.text
  )
  select
    pg_notify(channel, row_to_json(payload) :: text)
  from
    payload
);

return null;

end;

$$;

create trigger trigger_card_updated
after insert or update or delete on card
for each row execute procedure notify_card_updated('card.updated');

-- migrate:down
drop trigger if exists trigger_card_updated on card;

drop function if exists notify_card_updated;