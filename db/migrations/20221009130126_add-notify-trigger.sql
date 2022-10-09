-- migrate:up
create or replace function notify_card_updated ()
  returns trigger
  language plpgsql
as $$ 
declare
  channel text := tg_argv[0];

begin perform (
  with payload(id, x, y, text) as (
    select
      new.id,
      new.x,
      new.y,
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
after insert or update on card
for each row execute procedure notify_card_updated('card.updated');

-- migrate:down
drop trigger if exists trigger_card_updated on card;

drop function notify_card_updated;