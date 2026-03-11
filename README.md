# Prompt Refiner Web App

Prompt Refiner is a MERN‑stack web application that helps users turn vague ideas into clear, structured, and AI‑ready prompts.

## Why I Built This

I kept running into the same problem when using different AI agents: I had an idea of what I wanted, but struggled to phrase a **good** prompt. I built this project to help myself (and other users) quickly transform rough thoughts into clear, structured prompts that AI models can understand and respond to more effectively.

## What I Learned

- **Full‑stack MERN application architecture**
  - Designing and building a React frontend with routing, a dashboard, and reusable form components.
  - Structuring an Express API with controllers, middleware, and models in a clean, modular way.

- **Authentication and security**
  - Implementing registration and login with hashed passwords using bcrypt.
  - Using JWTs to protect routes and attach authenticated user data to requests.
  - Enforcing email verification so unverified users cannot log in or use protected features.

- **Email flows in production**
  - Building an email utility with Nodemailer and Mailgen for HTML/text emails.
  - Wiring it up to send verification and password reset emails using an SMTP provider.

- **Token‑based usage and data modelling**
  - Designing a simple token economy where each prompt conversion can deduct tokens.
  - Creating MongoDB models for users, prompt conversion logs, and token transactions.

- **AI integration**
  - Connecting the backend to OpenAI’s chat completions API.
  - Designing a “prompt‑for‑the‑prompt” so the model refines user input instead of answering it.

## Tech Stack

- **Frontend**: React 19, React Router, Vite, Tailwind CSS
- **Backend**: Node.js, Express 5, MongoDB (Mongoose)
- **Auth & Security**: JWT, bcrypt
- **Email**: Nodemailer + Mailgen (SMTP provider such as Resend)
- **AI Integration**: OpenAI (chat completions) for refining prompts

## High‑Level Modules

- `frontend/` – React SPA (Vite) for the landing page, auth pages, and dashboard UI.
- `backend/` – Express API server:
  - `src/controllers/` – Auth, prompt conversion, and token controllers.
  - `src/models/` – Mongoose models (`User`, `PromptConversionLog`, `TokenTransaction`).
  - `src/middleware/` – Auth middleware for protecting routes.
  - `src/utils/` – Email and OpenAI helper utilities.
