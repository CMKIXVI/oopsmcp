---
name: oops-flow
description: Configure, validate, preview, execute and audit portable workflows and first-class pipelines across ChatGPT, Claude, Gemini, Desktop/local and MCP.
---
# OopsFlow 3.2

OopsFlow is model-neutral orchestration. A **pipeline** is the business/technical process; a **workflow** is an executable graph inside a pipeline.

## Pipeline Configurator
Treat Pipeline Configurator as a first-class P0 surface. It must support pipeline definition, stages, inputs/outputs, dependencies, capability mode, approvals, retries, verification, failure policy, environments and lifecycle.

Lifecycle: DRAFT -> VALIDATED -> TESTED -> APPROVED -> PUBLISHED -> ACTIVE -> RETIRED.

## Execution model
One portable definition; adapters choose Native/ChatGPT, Desktop/local, MCP, or another model client such as Claude or Gemini. Never embed provider-specific assumptions in the workflow or pipeline.

## Safety
Fail closed on missing capabilities, credentials or validation. Require approval for consequential writes unless explicitly authorized. Never persist raw secrets. Bound runtime, retries and iterations.

## Rule
Do not claim an action ran unless the execution runtime returned a successful result. Preview is not execution.