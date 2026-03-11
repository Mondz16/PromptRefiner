# Prompt Refiner Web App

Prompt Refiner is a MERN‑stack web application that helps users turn vague ideas into clear, structured, and AI‑ready prompts. It includes authentication with email verification, a token‑based usage system, and a dashboard where users can refine prompts and track usage.

## Tech Stack

- **Frontend**: React 19, React Router, Vite, Tailwind CSS
- **Backend**: Node.js, Express 5, MongoDB (Mongoose)
- **Auth & Security**: JWT, bcrypt
- **Email**: Nodemailer + Mailgen (designed to work with SMTP providers like Resend)
- **AI Integration**: OpenAI (chat completions) for refining prompts

## Core Features

- **Prompt Refinement**
  - Users enter a rough prompt and optional metadata (target audience, tone, output format).
  - Backend sends the prompt to OpenAI to generate a refined, high‑quality version ready for AI tools.
  - Copy‑to‑clipboard UX from the dashboard.

- **Authentication & Email Verification**
  - Register/login with email and password.
  - Verification email with secure token; unverified users are blocked from logging in and from using the protected prompt converter.
  - Forgot‑password and reset‑password flows using signed tokens.

- **Token‑Based Usage Limits**
  - Anonymous users get a limited number of free demo conversions.
  - Authenticated users have a `tokenBalance`; each conversion can deduct tokens.
  - `PromptConversionLog` and `TokenTransaction` collections store audit/history data.

- **Dashboard Experience**
  - Prompt input with advanced options (tone, format, target).
  - Refined prompt output area.
  - Indicators for remaining free conversions and token balance.

## Project Structure

- `frontend/` – React SPA (Vite) for the landing page, auth pages, and dashboard UI.
- `backend/` – Express API server:
  - `src/controllers/` – Auth, prompt conversion, and token controllers.
  - `src/models/` – Mongoose models (`User`, `PromptConversionLog`, `TokenTransaction`).
  - `src/middleware/` – Auth middleware for protecting routes.
  - `src/utils/` – Email and OpenAI helper utilities.

## Environment Configuration (Backend)

Create a `.env` file in `backend/` (not committed to git) with values similar to:

```env
MONGO_URI=your-mongodb-connection-string
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=your-jwt-secret

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
EMAIL_FROM=no-reply@yourdomain.com

OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
FREE_CONVERSION_LIMIT=5
TOKENS_PER_CONVERSION=1
```

## Running the Project Locally

1. **Install dependencies**
   - From `backend/`: `npm install`
   - From `frontend/`: `npm install`
2. **Start backend**
   - From `backend/`: `npm run dev`
3. **Start frontend**
   - From `frontend/`: `npm run dev`
4. Open the frontend URL shown by Vite (usually `http://localhost:5173`).

## Deployment Notes

- **Frontend**: Designed to be deployed to platforms like Vercel.
- **Backend**: Designed for Node hosting such as Render or similar.
- Ensure `CLIENT_ORIGIN` on the backend is set to your deployed frontend URL, and your SMTP credentials point to a production email provider so verification emails are delivered successfully.

