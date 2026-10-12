-- Removes the abandoned bookmark-ID lookup if it was installed.
-- No table rows are deleted.
drop function if exists public.hydrate_bookmarked_article;
