# LinkedIn Hook Grader (Myntmore)

Next.js app. A visitor enters name, designation and email, pastes the first two lines of a LinkedIn post, and gets:
- a score out of 100 from 5 fixed rules (lib/score.js, plain code, no AI, same hook = same score)
- 3 rewrites from Gemini (gemini-2.5-flash) as structured JSON (responseSchema), checked in code against the writing rules, one retry

Each session is saved to the Supabase table `hook_sessions` and sent to an n8n webhook. A failure in either never breaks the visitor's result.

## Run
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the 4 values.
3. `npm run dev` and open http://localhost:3000

## Supabase table
```sql
create table if not exists hook_sessions (
  id bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name text, designation text, email text,
  hook text, score int, failed_rules jsonb, rewrites jsonb
);
alter table hook_sessions enable row level security;
```

## Deploy
Import the repo in Vercel and add the same 4 environment variables. Never commit `.env.local`.

## Rules (lib/score.js, 20 points each)
1. At most 210 characters and 2 lines
2. Contains a number
3. Does not start with an overused opener
4. Speaks to the reader ("you" or a question)
5. Does not start with I or We

Add a rule by adding one object to the `RULES` array. Scores then scale automatically only if you also change the points, so keep the total at 100.
