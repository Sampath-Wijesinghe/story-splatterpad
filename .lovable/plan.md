

## Assign Admin Role

Insert a record into the `user_roles` table to grant admin access to your account (`keesampath@gmail.com`).

### What will happen:
- Your user account will be assigned the "admin" role
- You'll be able to log in at `/auth` and access the Admin Panel at `/admin`
- You can manage products and blog posts from the dashboard

### Technical details:
- Run an `INSERT` into `user_roles` with your `user_id` and `role = 'admin'`
- User ID: `ab99ead8-900d-4441-bf4e-6624cc07b998`

