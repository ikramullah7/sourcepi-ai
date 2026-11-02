# Continuous integration

The [SourcePi AI CI workflow](.github/workflows/ci.yml) runs on pull requests,
pushes to `main`, and manual dispatch from GitHub's Actions tab. It uses
GitHub-hosted Ubuntu 24.04 runners. No repository secrets or self-hosted runners
are required. Actions are pinned to release commit SHAs.

| Check | What runs |
| --- | --- |
| Workflow validation | Actionlint validates active workflows, expressions and embedded shell; ShellCheck checks the CI shell scripts. |
| Frontend / format | `npm run format:check` |
| Frontend / lint | `npm run lint` |
| Frontend / types | `npm run type-check` |
| Frontend / tests | The full Jest suite in CI mode, with coverage and the existing coverage threshold. |
| Frontend / build | `npm run build` and a downloadable production frontend artifact. |
| Go formatting and native version consistency | All tracked Go files pass `gofmt`; `build.sh --check-ort-version` verifies native version declarations. |
| Docker Compose configuration | Resolve and validate the local deployment using checked-in example environment files, without reading real credentials or starting services. |
| CI | Requires every job above to succeed. |

Compose validation runs on temporary copies of the three Compose files, with
`.env` and `.env.local` populated from their checked-in examples. This satisfies
service-level `env_file` references on a clean runner and never overwrites or
reads a developer's local credentials.

Frontend checks run independently so a type error does not prevent the build,
lint or test job from reporting its own result. Failures are blocking: no checks
are marked `continue-on-error`, and no packages or failing tests are excluded.
Existing formatting, type or test failures must be fixed before the aggregate
`CI` check can turn green.

## Go checks and local testing

The Go version comes from `go.mod`; the frontend uses Node.js 24. CI runs Go
formatting and native version declaration checks only. It does not prepare native
libraries, compile Go binaries, run Go unit tests, or check server startup.

For backend changes, prepare the native dependencies described in
[the backend development guide](internal/development.md), then run
`bash build.sh --all` and the relevant package-scoped tests through
`bash build.sh --test ./path/to/package/...` locally. After a build, verify the
changed server modes start with their help commands.

The default Go unit tier needs no live external services. Integration and E2E
tests require their documented real services and credentials and are not part of
this workflow. Run those through `build.sh --test-integration` and
`build.sh --test-e2e` in a provisioned environment. The `manual` tier remains
local-only and is never selected by CI.

## Artifacts and branch protection

Successful frontend builds upload `frontend-dist`; frontend coverage
reports upload when available as `frontend-coverage`. Retention
is seven days. The workflow builds and checks the code; it does not publish a
container or deploy the application.

After pushing the workflow and allowing its first run, configure the repository's
branch protection or ruleset to require the check named **CI** before merging.
Workflow files cannot enforce branch protection by themselves.

## Local frontend checks

Before pushing, run from the repository root:

```bash
npm --prefix web run check
```

This runs the same frontend type, formatting and lint checks used by CI, stopping
at the first failure. It reports problems without changing files. For type errors
only, use `npm --prefix web run type-check`. While editing, keep continuous type
checking running in a separate terminal:

```bash
npm --prefix web run type-check:watch
```

These commands use the existing Node/npm dependencies in `web/node_modules`; on
a fresh checkout, install them with `npm --prefix web ci`. They need no Go,
native libraries or additional Homebrew packages. Development and production
builds do not replace type checking. Existing type errors must be fixed before
the check will pass; this command does not install a Git hook or run tests/builds.

## Local workflow validation

```bash
bash .github/scripts/check-workflows.sh
bash -n .github/scripts/*.sh
```

The validation script downloads a pinned, checksum-verified Actionlint binary on
Linux x64 or Apple Silicon. If ShellCheck is installed, Actionlint also checks
embedded shell locally. The Linux CI job explicitly requires ShellCheck.

Use the existing frontend commands and `build.sh` to reproduce individual jobs;
do not run the runner-provisioning script on a development machine.
