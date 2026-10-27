# OopsMCP Deployment & Help

## Official deployment flow

OopsMCP is intentionally **fork-first**. The official repository is the source/template. Your fork becomes your installation source, and your Vercel project deploys that fork.

```text
CMKIXVI/oopsmcp
      ↓
   Fork first
      ↓
YOUR-GITHUB-USERNAME/oopsmcp
      ↓
Deploy your fork to Vercel
      ↓
YOUR Vercel project
      ↓
Configure MCP address
      ↓
https://YOUR-DOMAIN/mcp
```

## 1. Fork OopsMCP

Use:

`https://github.com/CMKIXVI/oopsmcp/fork`

Create the fork under the GitHub account that should own the installation.

Your repository should then be:

`https://github.com/YOUR-GITHUB-USERNAME/oopsmcp`

## 2. Deploy your fork to Vercel

Sign in to Vercel with the account that should own the deployment.

Import **your fork**:

`YOUR-GITHUB-USERNAME/oopsmcp`

Vercel then builds and deploys your repository into your Vercel account.

**Do not deploy the upstream `CMKIXVI/oopsmcp` repository as your personal installation.**

Recommended settings:

- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output: Next.js default

## 3. Configure Supabase

Supabase is optional for the basic capability registry. Use your own Supabase project when you need persistent authentication, memory and content storage.

Run:

`supabase/schema.sql`

Set these Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Optional:

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## 4. Configure your MCP address

Every deployment exposes the MCP endpoint at:

`https://YOUR-PROJECT.vercel.app/mcp`

With a custom domain:

`https://YOUR-DOMAIN/mcp`

That is the address you register with your MCP-compatible clients.

The MCP address belongs to **your installation**, not the upstream repository.

## 5. Connect clients

Use your configured MCP address with compatible clients such as ChatGPT, Claude, Gemini, IDEs and other MCP clients.

## OopsMCP endpoints

Studio:

`https://YOUR-PROJECT.vercel.app/`

MCP:

`https://YOUR-PROJECT.vercel.app/mcp`

Install/help:

`https://YOUR-PROJECT.vercel.app/install`

Health:

`https://YOUR-PROJECT.vercel.app/api/health`

OopsFlow manifest:

`https://YOUR-PROJECT.vercel.app/api/oopsflow`

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

## FAQ

### Why fork first?

Your GitHub repository remains the source you own and customize. Vercel deploys your copy instead of making the upstream repository your personal source of truth.

### Can I use a custom MCP domain?

Yes. Point your custom domain to the Vercel project and use `/mcp` as the MCP endpoint.

### Can I update OopsMCP later?

Yes. Pull or merge upstream changes into your fork, review them, and redeploy your fork.

### Do I need Supabase?

No for the basic capability experience. Add it when you need persistent auth, memory or content storage.

## Production notes

Before exposing a private/write-enabled OopsMCP instance publicly, add production MCP authentication/OAuth and protect content/memory mutation endpoints. The capability registry currently provides the common execution contract; individual provider implementations must be connected before claiming that a domain action actually executed.
