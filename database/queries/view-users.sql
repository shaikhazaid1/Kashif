SELECT id,
       first_name,
       last_name,
       email,
       phone,
       role,
       password_hash,
       mfa_secret,
       mfa_enabled,
       failed_login_attempts,
       locked_until,
       created_at
FROM public.users
LIMIT 1000;