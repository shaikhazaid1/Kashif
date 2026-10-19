SELECT id,
       first_name,
       last_name,
       email,
       phone,
       role,
       password_hash,
       created_at
FROM public.users
LIMIT 1000;