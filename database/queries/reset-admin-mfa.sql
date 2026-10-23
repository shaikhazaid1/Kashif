UPDATE users
SET mfa_secret = NULL, mfa_enabled = false
WHERE email = 'shaikhaadmin@gmail.com';