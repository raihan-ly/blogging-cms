# Multi-User Blogging & Content Management System

A full-stack blogging platform built with **React** and **Supabase** that allows users to create, manage, and publish blog posts while enforcing **secure, user-level data ownership** and **public read-only access**.

The system supports:
- Google OAuth authentication  
- Author-specific content management  
- Public blog feed  
- Full article view  
- Search by title  
- Secure backend access using PostgreSQL Row Level Security (RLS)

---

## 🧠 System Architecture

![system_arch Medium](https://github.com/user-attachments/assets/de0a2936-b647-4522-b065-5132722ad823)

---

## 🔐 Authentication Flow

1. User signs in using **Google OAuth**  
2. Supabase creates an authenticated session  
3. On first login, a profile is created in the `profiles` table  
4. The user is redirected to `/dashboard`  
5. All subsequent requests include the user’s identity  

---

## 🗄️ Database Design

### `profiles`

| Column     | Purpose                         |
|------------|---------------------------------|
| id         | Links to Supabase Auth user      |
| full_name  | User’s name from Google profile |
| created_at | Account creation time           |

### `posts`

| Column     | Purpose             |
|------------|---------------------|
| id         | Unique post ID      |
| title      | Post title          |
| content    | Full article text   |
| author_id  | Owner of the post   |
| published  | Public or private   |
| created_at | Creation time       |
| updated_at | Last modified       |

---

## 🔒 Security Model (Row Level Security)

The database enforces:

- **Public users**  
  Can read only posts where `published = true`  

- **Authenticated users**  
  Can create, update, and delete **only their own posts**

This prevents:
- Editing someone else’s content  
- Viewing private drafts  
- Bypassing UI restrictions  

---

## 🖥️ Application Pages

| Route        | Access        | Purpose                     |
|-------------|---------------|------------------------------|
| `/`         | Public        | Browse published blog posts  |
| `/posts/:id`| Public        | Read full article            |
| `/login`    | Public        | Google OAuth login           |
| `/dashboard`| Authenticated | Manage your posts            |

---

## 🔍 Search

The public feed supports **search by title**, implemented using database-level queries for performance and accuracy.

---

## 📸 Screenshots

### Public Feed
**Before Login**  
![Public Feed Before Login](https://github.com/user-attachments/assets/02ca02bd-5d03-4c79-a493-55ec51e73bf5)

**After Login**  
![Public Feed After Login](https://github.com/user-attachments/assets/3cc3b1c6-3122-4f8e-8d5d-e30ff796bf6f)

### Post Detail
![Post Detail](https://github.com/user-attachments/assets/bc934d54-33c5-4abd-83d8-ab009675aaea)

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/ccfa23ee-8e12-4bb0-aa01-e5349685374d)

### Login Page
![Login Page](https://github.com/user-attachments/assets/b2d347ec-b445-4946-b2ce-7ca0adf0241e)

