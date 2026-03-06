

# Phase 1: Authentication, Admin Role, and Newsletter System

## Overview
Build a complete auth system with admin/user roles, newsletter subscriptions, and admin newsletter sending — all using the existing Resend API key and Lovable Cloud backend.

## Database Schema

### Tables to create via migration:

1. **`profiles`** — stores user metadata
   - `id` (uuid, PK, references auth.users)
   - `email` (text, not null)
   - `full_name` (text)
   - `created_at` (timestamptz, default now())

2. **`user_roles`** — role-based access (per security guidelines)
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users, not null)
   - `role` (app_role enum: 'admin', 'user')
   - Unique constraint on (user_id, role)

3. **`newsletter_subscribers`** — email list
   - `id` (uuid, PK)
   - `user_id` (uuid, references auth.users, nullable — allows future non-auth subscriptions)
   - `email` (text, unique, not null)
   - `subscribed_at` (timestamptz, default now())
   - `is_active` (boolean, default true)

4. **`newsletters`** — sent newsletters log
   - `id` (uuid, PK)
   - `subject` (text, not null)
   - `content` (text, not null)
   - `sent_by` (uuid, references auth.users)
   - `sent_at` (timestamptz, default now())
   - `recipient_count` (integer)

### Database functions & triggers:
- `has_role(user_id, role)` — security definer function for RLS
- Trigger on auth.users insert → auto-create profile
- RLS policies on all tables

### Admin setup:
- After you sign up with your email, I will insert an admin role for that email via a database function that checks the email.

## Authentication Pages

### `/auth` page with two tabs:
- **Sign Up**: email, password, full name. On signup, user is auto-subscribed to newsletter (with opt-out checkbox).
- **Sign In**: email, password. Redirects to home after login.
- **Forgot Password** link → sends reset email via built-in auth.

Styled to match the dark theme with gold accents.

## Navigation Changes
- Add "Sign In" button to navigation (visible when logged out)
- Show user avatar/icon + dropdown when logged in
- Admin users see an "Admin" link in the dropdown

## Newsletter Features

### For regular users:
- Newsletter opt-in checkbox during signup
- Manage subscription toggle in a simple account settings area

### For admin (you):
- **`/admin/newsletter`** page — compose and send newsletters
- Simple rich text editor (subject + body)
- Preview before sending
- "Send to All Subscribers" button
- Edge function `send-newsletter` that:
  - Verifies admin role
  - Fetches all active subscribers
  - Sends emails via Resend in batches
  - Logs the newsletter in the `newsletters` table

## Edge Functions

### `send-newsletter/index.ts`
- Validates JWT and checks admin role
- Fetches active subscribers from `newsletter_subscribers`
- Sends emails via Resend API (already configured)
- Returns success/failure count

## File Changes Summary

| Action | File |
|--------|------|
| Create | `src/pages/Auth.tsx` — login/signup page |
| Create | `src/pages/AdminNewsletter.tsx` — compose & send |
| Create | `src/components/auth/AuthForm.tsx` — form component |
| Create | `src/components/auth/UserMenu.tsx` — logged-in dropdown |
| Create | `src/hooks/useAuth.ts` — auth state hook |
| Create | `src/hooks/useAdmin.ts` — admin role check hook |
| Create | `src/components/auth/ProtectedRoute.tsx` — route guard |
| Create | `supabase/functions/send-newsletter/index.ts` |
| Modify | `src/components/Navigation.tsx` — add auth UI |
| Modify | `src/App.tsx` — add routes |
| Migration | Create tables, enum, functions, RLS policies, trigger |

## What's NOT in this phase (Phase 2 later):
- Admin CMS for editing portfolio cards
- Drag-and-drop image management
- Content editing across pages
- Card templates system

