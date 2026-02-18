

## Fix: Change All RLS Policies from Restrictive to Permissive

### The Problem
All RLS policies across every table (`user_roles`, `blog_posts`, `products`, `profiles`) are created as **RESTRICTIVE**. In PostgreSQL, restrictive policies only narrow access granted by permissive policies. Without any permissive policies, **no rows are ever returned** -- even for admins.

This means:
- The admin role check after login returns nothing
- The app thinks you're not an admin
- You get redirected back to the login page in an infinite loop

### The Fix
Drop all existing restrictive policies and recreate them as **permissive** (the default). No code changes are needed -- this is purely a database fix.

### Technical Details

A single database migration will:

1. **Drop all existing restrictive policies** on all four tables
2. **Recreate them as permissive policies** with the same logic

Tables and policies affected:

**user_roles** (1 policy)
- `Admins can view all roles` (SELECT)

**blog_posts** (5 policies)
- `Anyone can view published blog posts` (SELECT)
- `Admins can view all blog posts` (SELECT)
- `Admins can insert blog posts` (INSERT)
- `Admins can update blog posts` (UPDATE)
- `Admins can delete blog posts` (DELETE)

**products** (4 policies)
- `Anyone can view products` (SELECT)
- `Admins can insert products` (INSERT)
- `Admins can update products` (UPDATE)
- `Admins can delete products` (DELETE)

**profiles** (3 policies)
- `Users can view own profile` (SELECT)
- `Admins can view all profiles` (SELECT)
- `Users can update own profile` (UPDATE)

All policies keep the exact same access rules -- they just become permissive so they actually grant access.

