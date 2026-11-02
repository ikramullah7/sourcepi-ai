# SourcePi AI local frontend

The local frontend is branded SourcePi AI. Product text, login screens, embedded
pages, navigation, favicon, and logo are maintained in `web/`. Original copyright
and license notices remain in the source tree.

The local Compose override mounts `web/dist` read-only into the existing server
image at `/ragflow/web/dist`. Accounts, documents, provider settings, database
names, and API contracts use the existing backend.

From the repository root, build the frontend before starting the local deployment:

```sh
npm --prefix web ci
npm --prefix web run build
docker compose -p docker --env-file docker/.env --env-file docker/.env.local \
  -f docker/docker-compose.yml -f docker/docker-compose.local.yml \
  up -d --no-deps ragflow-cpu
```

After subsequent frontend builds, reload the browser. The assets are served from
the mounted build directory. Never commit `docker/.env.local` or provider keys.

The local deployment requires the generated `web/dist/index.html`; without it,
the mounted frontend directory cannot serve the application. Removing this one
frontend volume mapping returns to the frontend shipped in the upstream image.
