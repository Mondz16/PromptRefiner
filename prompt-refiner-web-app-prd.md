---
name: prompt-refiner-web-app-prd
overview: Product requirements for a web app that converts vague prompts into precise AI-ready prompts using a MERN stack with auth, dashboard, and token-based usage limits.
todos:
  - id: define-auth-flows
    content: Detail and confirm all authentication and email verification flows for implementation.
    status: completed
  - id: spec-token-economy
    content: Specify exact free conversion limit, per-conversion token cost, and initial token grants.
    status: completed
  - id: design-dashboard-ui
    content: Design the dashboard/demo UX for prompt input, output, and token/free-usage indicators.
    status: completed
  - id: finalize-api-contracts
    content: Finalize request/response shapes for auth, prompt conversion, and token endpoints.
    status: completed
isProject: false
---

## Prompt Refiner Web App – Product Requirements Document

### 1. Product Overview

- **Product name (working)**: PromptRefiner (placeholder; final branding TBD).
- **Purpose**: Help users convert vague, informal, or incomplete prompts into professional, precise, and structured prompts that AI models can understand and respond to more effectively.
- **Platform**: Web application (desktop-first, responsive for tablet and mobile).
- **Tech stack**: MongoDB, Express, React, Node.js (MERN).

### 2. Target Users & Use Cases

- **Target users**:
  - Individuals using AI chat tools (developers, students, writers, professionals) who struggle to get good outputs.
  - Power users who want to save time by having consistently high-quality prompts.
- **Primary use cases**:
  - **Refining a vague idea** into a clear question or task for an AI.
  - **Standardizing prompts** for recurring workflows (e.g., code review, email drafting, content outlines).
  - **Quick experimentation** with alternative prompt phrasings.

### 3. User Personas

- **Persona A – Casual User (Free tier)**
  - Uses AI a few times per week.
  - Wants occasional help turning rough ideas into good prompts.
  - Sensitive to cost; uses free tier mostly.
- **Persona B – Power User (Paid)**
  - Uses AI daily for work.
  - Wants reliability, speed, and history of refined prompts.
  - Willing to pay via tokens as long as pricing is fair and predictable.

### 4. Core Value Proposition

- **Input**: User provides a vague, unclear, or incomplete prompt.
- **Processing**: App analyzes and restructures the input into a more professional, detailed, and unambiguous prompt tailored for AI.
- **Output**: A refined prompt that:
  - Clearly states the task/goal.
  - Includes relevant constraints, tone, format, and context where possible.
  - Is ready to be copy-pasted into an AI tool.

### 5. Key Features & Requirements

#### 5.1 Dashboard / Demo Page

- **Goals**:
  - Showcase how the prompt conversion works.
  - Let new visitors try the tool quickly.
- **Functional requirements**:
  - **Landing + demo view** with:
    - Hero section explaining what the app does in 1–2 sentences.
    - Short visual walkthrough (text + simple illustration or GIF) of "vague prompt in" → "refined prompt out".
    - Live demo component (can be limited-use) where:
      - User types/pastes a vague prompt.
      - Clicks "Refine Prompt".
      - Sees refined prompt output below.
    - Clear call-to-action buttons: "Sign Up" / "Login".
  - **Usage indicators** on demo:
    - Show remaining free conversions (e.g., "2 of 3 free conversions left").
    - When limit reached, show message prompting registration/login and token purchase.
- **Non-functional**:
  - Fast initial load time (<3s on moderate connection).
  - Responsive design (works on mobile widths).

#### 5.2 Authentication

- **User data model (minimum fields)**:
  - Email (unique, required).
  - Password hash.
  - Email verification status (boolean).
  - Token balance (integer).
  - Role (e.g., `user`, `admin` for internal use).
  - Created/updated timestamps.
- **Login**:
  - Users can log in with email + password.
  - Backend validates credentials and returns a session token/JWT.
  - On success, redirect to main dashboard.
- **Registration**:
  - Collect minimum info: email, password, confirm password.
  - Validate password strength (basic rules: min length, etc.).
  - Create user with 0 or small initial token balance (TBD) and unverified email.
  - Send verification email with secure, time-limited link.
- **Email verification**:
  - When registering, user receives an email with verification link.
  - Clicking link sets email as verified and allows full access.
  - Unverified users can:
    - Optionally use only limited demo.
    - See prominent banner indicating email not verified.
- **Forgot password / reset password**:
  - "Forgot password" link on login page.
  - User enters email; if account exists, send secure, time-limited reset link.
  - Reset page allows setting new password after token validation.
- **Security requirements**:
  - Passwords always stored as salted hashes.
  - JWT/token expiration and refresh strategy (high-level):
    - Short-lived access tokens.
    - Optionally refresh tokens stored securely.
  - Rate limiting on login and password reset endpoints.

#### 5.3 Prompt Conversion Engine

- **Input**:
  - Single text area input for the user’s vague prompt.
  - Optional fields for:
    - Target AI type (e.g., "coding assistant", "writer", "tutor") – simple dropdown.
    - Desired tone (e.g., neutral, friendly, formal).
    - Output format (e.g., bullet list, step-by-step instructions, outline, email, etc.).
- **Processing requirements**:
  - Backend API endpoint `/api/convert-prompt` (exact path TBD) that:
    - Accepts user prompt and optional metadata.
    - Validates input length and content.
    - Deducts tokens as required (paid users) or checks free quota.
    - Calls internal conversion logic (which may call an AI model, rules, or templates; implementation detail for later).
    - Returns refined prompt and optional explanation of changes (e.g., bullets of "what was improved").
- **Output**:
  - Refined prompt displayed in a read-only text area.
  - Copy-to-clipboard button.
  - Optional: mini diff-style or bullet summary of how the prompt was improved.
- **Quality constraints** (non-functional):
  - Round-trip latency target: initial version can be up to a few seconds, but aim for <5s under normal load.
  - Handle malformed input (empty, too short, too long) with clear validation messages.

#### 5.4 Free Version Limits

- **Goal**: Let users experience the value before paying, while controlling costs.
- **Requirements**:
  - Free users (unauthenticated or without tokens) are limited to **3–5 conversions**.
    - Exact number (3 or 5) configurable via environment/setting.
  - Distinguish between:
    - **Anonymous visitor**: Track conversions per browser (e.g., cookie/localStorage) for demo limits.
    - **Registered user with no tokens**: Track conversions against their account.
  - When limit is reached:
    - Disable further conversions or show an error message.
    - Display banner/modal prompting user to register or buy tokens.
  - Admin configuration (future): ability to change free limit.

#### 5.5 Token-Based Pricing Model

- **Concept**: Each prompt conversion consumes a certain number of tokens. Users must maintain a positive token balance to continue using beyond free limits.
- **Token model requirements**:
  - Each user account has a `tokenBalance` field.
  - Each successful conversion deducts a fixed number of tokens (e.g., 1 token per conversion; configurable).
  - If a conversion fails (e.g., server error), tokens are **not** deducted or are refunded.
  - When `tokenBalance <= 0`, block conversions beyond any free quota and show message prompting purchase.
- **Token purchase flow (high-level)**:
  - Pricing tiers and payment provider integration specifics can be defined later, but PRD requires:
    - A `Purchase Tokens` entry point/button on dashboard.
    - Basic pricing concept (example, not final):
      - 50 tokens
      - 200 tokens
      - 1000 tokens
    - After payment success, increment user’s token balance.
  - For this initial PRD, payment integration can be scoped as:
    - **MVP**: Assume manual or mock recharge (e.g., admin updates tokens) or test payment sandbox.
    - **Later**: Integrate with actual payment provider (Stripe, etc.).
- **Visibility**:
  - Show current token balance in navigation or dashboard header.
  - Show approximate remaining number of conversions based on current per-conversion token cost.

### 6. User Flows

#### 6.1 New User – Free Demo to Signup

1. User lands on homepage/demo dashboard.
2. Reads a short explanation and tries demo with a vague prompt.
3. Gets refined prompt and sees remaining free conversions (e.g., "2 of 3 free conversions left").
4. After hitting free limit, user sees a prompt to register.
5. User signs up, verifies email, and gets access to full dashboard with token information.

#### 6.2 Registered User – Prompt Conversion

1. User logs in.
2. Sees dashboard with:
  - Prompt input area.
  - Optional advanced options (tone, format, target AI).
  - Current token balance and remaining free conversions (if any).
3. User submits vague prompt.
4. System checks:
  - Email verified?
  - Sufficient free quota or token balance?
5. If allowed, backend processes and returns refined prompt.
6. Token is deducted from user balance.
7. User copies refined prompt and optionally saves it (future feature).

#### 6.3 Token Purchase (Conceptual for MVP)

1. User clicks `Purchase Tokens`.
2. User sees pricing options and selects a pack.
3. (MVP: either simulate purchase or integrate basic payment test mode.)
4. After success, token balance updates and user is notified.

### 7. Non-Functional Requirements

- **Performance**:
  - Backend endpoints should respond reliably within a few seconds under normal load.
- **Scalability**:
  - Design APIs and MongoDB schema to support future scaling (indexes on user identifiers, etc.).
- **Security**:
  - Use HTTPS (enforced in production).
  - Secure password storage and JWT handling.
  - Sanitize inputs to prevent injection attacks.
- **Reliability**:
  - Basic error logging for all major operations (auth, prompt conversion, token operations).
- **Maintainability**:
  - Clear separation of concerns between frontend React components, backend routes, and services.

### 8. API Endpoints (High-Level)

- **Auth**:
  - `POST /api/auth/register` – create user, send verification email.
  - `POST /api/auth/login` – authenticate and return token/session.
  - `POST /api/auth/forgot-password` – initiate password reset.
  - `POST /api/auth/reset-password` – complete password reset.
  - `GET /api/auth/verify-email` – verify email via token.
- **Prompt conversion**:
  - `POST /api/prompt/convert` – convert vague prompt to refined prompt; checks quota/tokens and deducts.
- **Tokens**:
  - `GET /api/tokens/balance` – get user token balance.
  - `POST /api/tokens/purchase` – start or simulate token purchase (details TBD).

### 9. Data Model (High-Level)

- **User** (MongoDB collection `users`):
  - `_id` (ObjectId)
  - `email` (string, unique)
  - `passwordHash` (string)
  - `isEmailVerified` (boolean)
  - `tokenBalance` (number, default 0)
  - `role` (string, default `user`)
  - `createdAt`, `updatedAt` (timestamps)
- **PromptConversionLog** (for analytics/future features, optional for MVP):
  - `_id`
  - `userId` (nullable for anonymous/demo)
  - `inputPrompt` (string)
  - `outputPrompt` (string)
  - `tokensUsed` (number)
  - `createdAt`
- **TokenTransaction** (for auditing, optional for MVP):
  - `_id`
  - `userId`
  - `amount` (positive for purchase, negative for deduction)
  - `type` (e.g., `conversion`, `purchase`, `manual_adjustment`)
  - `createdAt`

### 10. UX/UI Requirements

- **Design style**:
  - Clean, modern UI emphasizing clarity of input and output.
  - Clear hierarchy: prompt input at top/center; refined prompt output directly below or side-by-side on larger screens.
- **Accessibility**:
  - Adequate color contrast.
  - Keyboard navigability for main actions (submit, copy, login).
- **Feedback & error states**:
  - Loading indicator while prompt is being refined.
  - Friendly error messages for network errors or server issues.
  - Clear explanation when free limit or tokens are exhausted.

### 11. Out of Scope (Initial Version)

- Complex team/collaboration features.
- Advanced analytics dashboards.
- Full production-grade payment integration (beyond basic or mocked flow, unless explicitly prioritized later).
- Multi-language localization.

### 12. Future Enhancements (Nice-to-Have)

- Prompt templates library that users can reuse.
- History of refined prompts with search and tagging.
- Different AI backends or models selectable by user.
- Organization/team accounts with shared token pools.

