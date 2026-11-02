# SourcePi AI branding audit

Audit date: 29 October 2026. Scope: the full tracked project text, excluding actual local environment files, dependencies installed into node_modules, and generated builds. No credentials were printed or included in the occurrence inventory.

## Product branding completed

The interface uses SourcePi AI in the application configuration, browser title, favicon, logo, authentication screens, welcome screens, search header, embedded pages, API panel titles, and translated product text. Upstream promotional navigation links have been removed.

This follow-up removes remaining product wording from connector tooltips, the agent framework prompt menu, the Traditional Chinese example, OAuth popup window names, browser theme storage, and model-list cache storage. Newly created sitemap connectors default to SourcePiAI-SitemapConnector/1.0. Existing saved connector settings remain unchanged. Cloud-hostname-specific UI conditions have been removed; the local deployment's previous behavior is retained.

Saved browser theme preferences and model-list cache entries move to the SourcePi AI storage keys before the application starts. Existing values under the new keys take precedence. Accounts, provider credentials, datasets, chats, server-side data, the checkout path and the Git remote are unchanged.

## References that remain

These are real implementation or provenance references, not additional interface branding that can safely be replaced as text:

| Area | Reason and work needed |
| --- | --- |
| Copyright headers and license | Original attribution remains. Branding is separate from original authorship. |
| Published backend image | The deployment uses infiniflow/ragflow:v1.0.0-rc2. Its executable, runtime logs, and version metadata cannot be renamed by rebuilding only the frontend. A separately built and validated backend image is needed. |
| Go module and imports | The module is ragflow; thousands of imports reference that path. A coordinated source rename and native Go build are required. |
| Runtime paths and startup | The image expects /ragflow paths, existing binary names, configuration keys, and environment variables. Image packaging, entrypoints, build scripts, tests, and Compose must change together. |
| Persisted services | Database names, service registries, queue subjects, cache prefixes, and the initialized system administrator identify the current backend. Changing these requires an explicit data-preservation plan and runtime migration. |
| OAuth and API contracts | Connector popup messages and MCP import platform values match the backend implementation. Renaming only frontend values would break those integrations. |
| Frontend component identifiers | Internal component names and filenames include the old name. Some belong to the shared UI library, whose local instructions require explicit approval before modification. These identifiers are not displayed as product labels. |
| External dependency coordinates | URLs and module names point to real upstream packages, resources, and model artifacts. Inventing replacement URLs would break downloads or builds. |
| Source documentation, examples, and SDKs | Original project documentation and historical examples are retained as provenance; rewritten SourcePi AI documentation can replace active product guidance as the backend packaging is established. |
| Original workflow definitions | Retained outside the active GitHub workflows directory. They cannot run automatically in the new repository. |
| User content | Uploaded documents, user-defined chat names, and existing saved connector configurations are not rewritten. |

## Approval boundary

The safe frontend cleanup does not rename database contents, queue state, backend protocols, or the upstream container. A full internal rename must be treated as a backend/package migration, with image builds and focused tests, rather than global search-and-replace. No code is committed or pushed by this audit.
