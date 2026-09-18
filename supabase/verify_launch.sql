do $$
declare
  required_table text;
  required_tables text[] := array[
    'service_categories',
    'inventory_parts',
    'paint_formula_records',
    'estimate_requests',
    'contact_requests',
    'site_settings'
  ];
  visible_parent_count integer;
begin
  foreach required_table in array required_tables loop
    if to_regclass('public.' || required_table) is null then
      raise exception 'Launch verification failed: missing table public.%', required_table;
    end if;
  end loop;

  select count(*) into visible_parent_count
  from public.service_categories
  where parent_id is null and is_visible = true;

  if visible_parent_count < 4 then
    raise exception 'Launch verification failed: expected at least 4 visible parent service categories, found %', visible_parent_count;
  end if;

  if not exists (select 1 from public.site_settings where setting_key = 'business_name') then
    raise exception 'Launch verification failed: business_name setting is missing';
  end if;

  raise notice 'Auto And All Automotive database launch verification passed.';
end;
$$;
