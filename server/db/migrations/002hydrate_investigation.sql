-- returns null when the investigation is nonexistant or belongs to another user.
create or replace function public.hydrate_investigation(
  p_user_id uuid,
  p_investigation_id bigint
)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'investigation', to_jsonb(i),
    'notes', (
      select coalesce(
        jsonb_agg(to_jsonb(n) order by n.created_at, n.id),
        '[]'::jsonb
      )
      from public.notes n
      where n.investigation_id = i.id
        and n.user_id = p_user_id
    ),
    'sources', (
      select coalesce(jsonb_agg(to_jsonb(a) order by s.created_at, s.id), '[]'::jsonb)
      from public.investigation_sources s
      join public.articles a on a.id = s.article_id
      where s.investigation_id = i.id
        and s.user_id = p_user_id
    ),
    'extracts', (
      select coalesce(jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'user_id', e.user_id,
          'investigation_id', e.investigation_id,
          'kind', e.kind,
          'title', e.title,
          'pageUrl', e.page_url,
          'lastUpdated', e.last_updated
        ) || case when e.kind = 'summary' then
          jsonb_build_object(
            'extract', e.extract,
            'description', e.description,
            'thumbnail', e.thumbnail
          )
        else
          jsonb_build_object('candidates', (
            select coalesce(jsonb_agg(jsonb_build_object(
              'pageid', c.page_id,
              'title', c.title,
              'extract', c.extract,
              'url', c.url,
              'thumbnail', c.thumbnail,
              'lastUpdated', c.last_updated
            ) order by c.position), '[]'::jsonb)
            from public.investigation_extract_candidates c
            where c.extract_id = e.id
          ))
        end
        order by e.captured_at, e.id
      ), '[]'::jsonb)
      from public.investigation_extracts e
      where e.investigation_id = i.id
        and e.user_id = p_user_id
    )
  )
  from public.investigations i
  where i.id = p_investigation_id
    and i.user_id = p_user_id;
$$;

revoke execute on function public.hydrate_investigation(uuid, bigint)
  from public, anon, authenticated;

grant execute on function public.hydrate_investigation(uuid, bigint)
  to service_role;
