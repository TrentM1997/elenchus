begin;

create or replace function public.get_bookmarked_articles(
  p_user_id uuid
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(to_jsonb(a) order by b.created_at desc, b.id desc),
    '[]'::jsonb
  )
  from public.bookmarks b
  join public.articles a on a.id = b.article_id
  where b.user_id = p_user_id;
$$;

revoke execute on function public.get_bookmarked_articles(uuid)
  from public, anon, authenticated;

grant execute on function public.get_bookmarked_articles(uuid)
  to service_role;

commit;
