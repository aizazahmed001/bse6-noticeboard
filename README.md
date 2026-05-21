# bse6-noticeboard

Campus Notice Board — Full-stack app with Supabase auth, Realtime updates, and a dynamic notice feed.

## Overview

This project is a React + Vite application built for the BSE-6A Cloud Computing lab. It uses Supabase for authentication and backend storage.

## Local setup

1. Copy .env.example to .env.
2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
3. Install dependencies:
   `ash
   npm install
   `
4. Start the dev server:
   `ash
   npm run dev
   `

## Features

- Sign in and sign out with Supabase Auth
- Post notices with categories
- Realtime notice updates
- Delete notices by owner
