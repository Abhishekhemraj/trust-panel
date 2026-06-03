# Trust Panel — AI Output Evaluation Layer

A Next.js app that helps users evaluate AI-generated outputs through sources, assumptions, confidence analysis, and probe questions.

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Create `.env.local` with your API keys:
   ```
   GROK_API_KEY=your_grok_api_key_here
   BRAVE_SEARCH_API_KEY=your_brave_search_key_here
   ```
4. Run locally: `npm run dev`

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard:
   - `GROK_API_KEY`
   - `BRAVE_SEARCH_API_KEY`
4. Deploy

> Note: The app works without a Brave Search API key — mock sources will be shown. Get a free key at brave.com/search/api

## How it works

- User sends a prompt → Grok generates a response
- A parallel evaluation pipeline extracts claims, assumptions, confidence levels, and probe questions
- Source retrieval maps each factual claim to real web sources
- The trust bar appears below each response — tap it to expand the full panel
- The panel has 4 tabs: Sources, Assumptions, Confidence, Go Deeper
