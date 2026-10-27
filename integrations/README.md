# OopsMCP + OopsFlow

OopsFlow 3.2.0 is bundled under `integrations/oopsflow/` as an embedded capability.

## Intended architecture

- OopsMCP: MCP protocol, identity, permissions, memory, connections, content registry and external-client gateway.
- OopsFlow: workflow/pipeline/agent execution layer.
- Supabase: persistence, auth, memory and workflow metadata.
- Vercel: deployment/runtime.

The next production step is to wire the actual OopsFlow runtime into MCP tools such as:

- `oopsflow.list_pipelines`
- `oopsflow.get_pipeline`
- `oopsflow.run_pipeline`

The source bundle is included so the integration can evolve without making OopsMCP dependent on a separate deployment.