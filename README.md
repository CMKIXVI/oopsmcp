# OopsMCP v1.5.0

OopsMCP is a role-based MCP toolbox with 500 practical capabilities and a dedicated UI workspace for every tool.

## 🚀 Deploy OopsMCP — Fork First, Deploy Second

**The intended flow is:**

**Your GitHub → your fork → your Vercel → your OopsMCP**

### 1. Fork OopsMCP to your GitHub

[**🍴 Fork OopsMCP**](https://github.com/CMKIXVI/oopsmcp/fork)

### 2. Deploy your fork to Vercel

After the fork is created, use the [**OopsMCP Help & Deploy page**](https://CMKIXVI.github.io/oopsmcp/) to enter your GitHub username and generate a Vercel deployment link for **your fork**.

This prevents the upstream `CMKIXVI/oopsmcp` repository from becoming the source of your personal deployment.

### 3. Configure Supabase if needed

Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the Vercel project when you want persistent authentication, memory and content storage.

## Complete Help

- [Deployment guide](DEPLOY.md)
- [GitHub Pages Help & Deploy](https://CMKIXVI.github.io/oopsmcp/)
- [Install page](https://github.com/CMKIXVI/oopsmcp/tree/main/app/install)

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
- GitHub Pages deployment/help center
- PWA manifest

## Architecture

```text
GitHub upstream
      ↓
User forks OopsMCP
      ↓
User's GitHub repository
      ↓
Vercel imports user's fork
      ↓
User's OopsMCP Studio + /mcp
      ↓
Optional Supabase + OopsFlow
```

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
