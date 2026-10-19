SELECT id,
       full_name,
       email,
       password_hash,
       role,
       is_active,
       created_at
FROM public.users
LIMIT 1000;