# OopsFlow Pipeline Runtime

Pipelines are first-class objects above workflows. A pipeline is a staged execution plan with explicit dependencies, lifecycle state, environment-neutral capability mode, failure policy, and audit history.

Lifecycle: `DRAFT -> VALIDATED -> TESTED -> APPROVED -> PUBLISHED -> ACTIVE -> RETIRED`.

Runtime rules:
- Only `PUBLISHED` or `ACTIVE` pipelines execute normally.
- `pipeline.run` with `dry_run=true` previews without requiring publication.
- Stages may reference existing OopsFlow workflows.
- Stage dependencies are explicit and must reference valid stage IDs.
- No cloud runtime is required; execution remains local/native/MCP-adapter driven.