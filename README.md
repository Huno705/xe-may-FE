# Showroom Frontend

Vite + React (JavaScript) frontend for the motorcycle showroom. No cart, no checkout — display only, with an admin area to manage inventory.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and point it at the backend:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

## Pages

- `/` — public grid of all motorcycles (name, price, thumbnail)
- `/xe/:id` — public detail page (image gallery, name, price, description)
- `/login` — admin login
- `/admin` — admin dashboard: list, edit, delete motorcycles (requires login)
- `/admin/xe/moi` — add a new motorcycle (requires login)
- `/admin/xe/:id` — edit a motorcycle (requires login)

## Design

Dark, atmospheric showroom aesthetic (Catalogue macrostructure) — see [src/styles/tokens.css](src/styles/tokens.css) for the design tokens (colour, type, spacing, motion).
