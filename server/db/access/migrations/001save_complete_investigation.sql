-- Requires public.notes with its defaults and composite investigation-owner FK.
-- Apply the signature change and permissions atomically.
begin;

drop function if exists public.save_complete_investigation(
  uuid, jsonb, bigint[], jsonb
);

create or replace function public.save_complete_investigation(
  p_user_id uuid,
  p_investigation jsonb,
  p_article_ids bigint[],
  p_extracts jsonb,
  p_notes jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_investigation public.investigations%rowtype;
  v_extract jsonb;
  v_extract_id public.investigation_extracts.id%type;
begin
  if p_user_id is null then
    raise exception 'User ID is required';
  end if;

  if jsonb_typeof(p_investigation) is distinct from 'object' then
    raise exception 'Investigation must be an object';
  end if;

  if jsonb_typeof(p_extracts) is distinct from 'array' then
    raise exception 'Extracts must be an array';
  end if;

  if jsonb_typeof(p_notes) is distinct from 'array' then
    raise exception 'Notes must be an array';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_notes) as note(value)
    where jsonb_typeof(note.value) is distinct from 'object'
      or jsonb_typeof(note.value -> 'content') is distinct from 'object'
  ) then
    raise exception 'Each note must contain a content object';
  end if;

  -- 1. Save the investigation and obtain its generated ID.
  insert into public.investigations (
    user_id,
    idea,
    initial_perspective,
    ending_perspective,
    expertise,
    biases,
    premises,
    takeaway,
    changed_opinion,
    new_concepts,
    had_merit
  )
  values (
    p_user_id,
    p_investigation ->> 'idea',
    p_investigation ->> 'initial_perspective',
    p_investigation ->> 'ending_perspective',
    p_investigation ->> 'expertise',
    p_investigation ->> 'biases',
    p_investigation ->> 'premises',
    p_investigation ->> 'takeaway',
    (p_investigation ->> 'changed_opinion')::boolean,
    (p_investigation ->> 'new_concepts')::boolean,
    (p_investigation ->> 'had_merit')::boolean
  )
  returning * into v_investigation;

  -- 2. Link the existing articles to this investigation.
  insert into public.investigation_sources (
    user_id,
    investigation_id,
    article_id
  )
  select
    p_user_id,
    v_investigation.id,
    source.article_id
  from unnest(p_article_ids) as source(article_id);

  -- 3. Save Wikipedia extracts.
  for v_extract in
    select value from jsonb_array_elements(p_extracts)
  loop
    if (v_extract ->> 'kind') is null
       or (v_extract ->> 'kind') not in ('summary', 'disambiguation')
    then
      raise exception 'Invalid Wikipedia extract kind';
    end if;

    insert into public.investigation_extracts (
      user_id,
      investigation_id,
      kind,
      title,
      page_url,
      last_updated,
      extract,
      description,
      thumbnail
    )
    values (
      p_user_id,
      v_investigation.id,
      v_extract ->> 'kind',
      v_extract ->> 'title',
      v_extract ->> 'pageUrl',
      nullif(v_extract ->> 'lastUpdated', '')::timestamptz,
      case when v_extract ->> 'kind' = 'summary'
        then v_extract ->> 'extract' end,
      case when v_extract ->> 'kind' = 'summary'
        then v_extract ->> 'description' end,
      case when v_extract ->> 'kind' = 'summary'
        then v_extract ->> 'thumbnail' end
    )
    returning id into v_extract_id;

    -- 4. Save candidates for disambiguation extracts.
    if v_extract ->> 'kind' = 'disambiguation' then
      if jsonb_typeof(v_extract -> 'candidates') is distinct from 'array' then
        raise exception 'Disambiguation candidates must be an array';
      end if;

      insert into public.investigation_extract_candidates (
        extract_id,
        extract_kind,
        page_id,
        position,
        title,
        extract,
        url,
        thumbnail,
        last_updated
      )
      select
        v_extract_id,
        'disambiguation',
        (candidate.value ->> 'pageid')::bigint,
        (candidate.ordinality - 1)::integer,
        candidate.value ->> 'title',
        candidate.value ->> 'extract',
        candidate.value ->> 'url',
        candidate.value ->> 'thumbnail',
        nullif(candidate.value ->> 'lastUpdated', '')::timestamptz
      from jsonb_array_elements(v_extract -> 'candidates')
        with ordinality as candidate(value, ordinality);
    end if;
  end loop;

  -- 5. Save note documents; the database supplies IDs and creation timestamps.
  insert into public.notes (user_id, investigation_id, content)
  select p_user_id, v_investigation.id, note.value -> 'content'
  from jsonb_array_elements(p_notes) as note(value);

  return jsonb_build_object(
    'investigation', to_jsonb(v_investigation),
    'notes', (
      select coalesce(
        jsonb_agg(to_jsonb(n) order by n.created_at, n.id),
        '[]'::jsonb
      )
      from public.notes n
      where n.investigation_id = v_investigation.id
        and n.user_id = p_user_id
    ),
    'sources', (
      select coalesce(jsonb_agg(to_jsonb(a) order by requested.position), '[]'::jsonb)
      from unnest(p_article_ids) with ordinality as requested(article_id, position)
      join public.investigation_sources s
        on s.article_id = requested.article_id
        and s.investigation_id = v_investigation.id
        and s.user_id = p_user_id
      join public.articles a on a.id = s.article_id
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
      where e.investigation_id = v_investigation.id
        and e.user_id = p_user_id
    )
  );
end;
$$;

-- Only the server's service-role client may invoke this function.
revoke execute on function public.save_complete_investigation(
  uuid, jsonb, bigint[], jsonb, jsonb
) from public, anon, authenticated;

grant execute on function public.save_complete_investigation(
  uuid, jsonb, bigint[], jsonb, jsonb
) to service_role;

commit;
