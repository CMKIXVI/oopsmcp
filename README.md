# OopsMCP v1.5.0

OopsMCP is a role-based MCP toolbox with 500 practical capabilities and a dedicated UI workspace for every tool.

## Deploy OopsMCP — Fork First, Deploy Second

**The intended flow is:**

**Official GitHub → your fork → your Vercel → your OopsMCP**

### 1. Fork OopsMCP

[**🍴 Fork OopsMCP**](https://github.com/CMKIXVI/oopsmcp/fork)

Create the fork under the GitHub account that should own your installation.

### 2. Deploy your fork to Vercel

After the fork exists, import **your fork** into Vercel:

`https://github.com/YOUR-GITHUB-USERNAME/oopsmcp`

Do not deploy the upstream `CMKIXVI/oopsmcp` repository as your personal installation.

### 3. Configure your MCP address

Your deployed MCP endpoint is:

`https://YOUR-PROJECT.vercel.app/mcp`

You can also configure a custom domain and use:

`https://YOUR-DOMAIN/mcp`

Use that address with your MCP-compatible clients.

## Complete Help

- [Deployment guide](DEPLOY.md)
- [Install page](https://github.com/CMKIXVI/oopsmcp/tree/main/app/install)
- [Official GitHub repository](https://github.com/CMKIXVI/oopsmcp)

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

## Architecture

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
Your OopsMCP Studio + /mcp
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

After deployment:

`https://YOUR_PROJECT.vercel.app/mcp`

## Supabase

Run `supabase/schema.sql` in your Supabase project and configure the variables in `.env.local` or Vercel.

## Repository

https://github.com/CMKIXVI/oopsmcp
