# MindMate AI

Student mental wellness companion for exam and result seasons, built with Next.js App Router, TypeScript, Tailwind CSS, ShadCN-style components, Framer Motion, Recharts, Zod, React Hook Form, and local persistence.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## AI setup

Create `.env.local`:

```bash
GROQ_API_KEY=your_key_here
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.1-8b-instant
```

If the Groq API key is missing or the request fails, MindMate keeps working with rule-based fallback coaching.

## Features

- Mock sign in, sign up, onboarding, and local profile persistence
- Dashboard with exam countdown, wellness score, AI insights, burnout alerts, recent logs, and quick actions
- Mood tracker with CRUD, filters, charts, triggers, sleep, stress, and notes
- Stress trigger analyzer with frequency charts and pattern suggestions
- Guided journal with prompts, gratitude, reflections, search, edit, and delete
- AI wellness coach API route with safe fallback responses
- Analytics dashboard with Recharts visualizations
- Calm Corner with breathing, grounding, affirmations, and reset timers
- Achievements, streaks, data export/import, dark mode, and responsive navigation

## Safety note

MindMate is supportive software, not a diagnosis tool or replacement for professional mental health care. If someone is in immediate danger or may harm themselves, contact local emergency services or a trusted person right away.
