# OopsMCP Deployment & Help

## The intended deployment flow

OopsMCP uses a **fork-first** model:

1. Fork `CMKIXVI/oopsmcp` into your own GitHub account.
2. Deploy **your fork** to Vercel.
3. Your GitHub fork remains the source of truth for your deployment.
4. Configure Supabase when you need persistent auth, memory and content storage.

## GitHub Pages help center

The repository includes a complete static deployment/help page in `docs/index.html`.

After enabling GitHub Pages with **GitHub Actions** as the source, it is published at:

`https://CMKIXVI.github.io/oopsmcp/`

The page provides the Fork → Deploy flow, generates a Vercel deploy link for the user's fork, setup instructions, architecture, FAQ and endpoint information.

### Enable Pages once

In the GitHub repository:

`Settings → Pages → Build and deployment → Source: GitHub Actions`

The workflow is already included at `.github/workflows/pages.yml`.

## Fork

Use:

`https://github.com/CMKIXVI/oopsmcp/fork`

Create the fork under the GitHub account that should own the deployment.

## Vercel

After the fork exists, use the GitHub Pages help page or Vercel import flow and select the user's fork. The deployment URL must point to the user's repository, for example:

`https://github.com/YOUR-USERNAME/oopsmcp`

Do **not** deploy the upstream `CMKIXVI/oopsmcp` repository when creating a personal installation.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL editor.

Set these Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Optional:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## Endpoints

Studio:

`https://YOUR_PROJECT.vercel.app/`

MCP:

`https://YOUR_PROJECT.vercel.app/mcp`

Install/help:

`https://YOUR_PROJECT.vercel.app/install`

Health:

`https://YOUR_PROJECT.vercel.app/api/health`

OopsFlow manifest:

`https://YOUR_PROJECT.vercel.app/api/oopsflow`

## Dedicated tool UI

Each of the 500 registered capabilities is reachable from:

`/tools/<tool-id>`

## Local setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Docker

```bash
docker compose up --build
```

## Important production notes

Before exposing a private/write-enabled OopsMCP instance publicly, add production MCP authentication/OAuth and protect content/memory mutation endpoints. The capability registry currently provides the common execution contract; individual provider implementations must be connected before claiming that a domain action actually executed.
