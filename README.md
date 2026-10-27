# OopsMCP v1.5.0

OopsMCP is a role-based MCP toolbox with 500 practical capabilities and a dedicated UI workspace for every tool.

## What is included

- 500 functional capabilities
- 25 roles with 20 tools each
- Dedicated UI at `/tools/<tool-id>` for every tool
- MCP endpoint at `/mcp`
- OopsMCP Studio at `/`
- Install/setup page at `/install`
- Supabase schema and authentication support
- OopsFlow integration bundle
- Docker deployment
- Vercel deployment
- PWA manifest

## Deploy with Vercel

[Deploy OopsMCP with Vercel](https://vercel.com/new/clone?demo-title=OopsMCP&demo-description=Deploy%20OopsMCP%3A%20a%20500-tool%20MCP%20capability%20studio%20with%20dedicated%20tool%20UIs.&project-name=oopsmcp&repository-name=oopsmcp&repository-url=https%3A%2F%2Fgithub.com%2FCMKIXVI%2Foopsmcp&from=templates&skippable-integrations=1)

## Local

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## MCP

After deployment, use:

`https://YOUR_PROJECT.vercel.app/mcp`

## Supabase

Run `supabase/schema.sql` in your Supabase project and configure the variables in `.env.local` or Vercel.

## Repository

https://github.com/CMKIXVI/oopsmcp