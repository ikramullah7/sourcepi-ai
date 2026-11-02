# SourcePi AI local setup

## Current migration

The source was copied from /Users/ikram/source/rag-ind/ragflow into /Users/ikram/source/answer-whiz-ai without copying Git history. The existing origin points to the new SourcePi AI repository. No upstream remote is configured.

The existing Colima images and Docker data volumes remain in place. Local configuration and credentials were copied privately to docker/.env and docker/.env.local; neither is committed. Existing database credentials must not be regenerated.

## Configuration

For a separate new installation, copy docker/.env.example to docker/.env and docker/.env.local.example to docker/.env.local, then fill in unique credentials and set permissions to 600. Do not overwrite an existing installation's credentials. The bundled login PEM pair is upstream application material, not a personal OpenAI key; rotating it requires coordinating frontend and backend encryption.

The local override fixes the Compose project name to docker to retain docker_mysql_data, docker_esdata01, docker_kvrocks_data, docker_minio_data, and docker_nats_data. Do not change that project name when reusing existing data. Never run old and new deployments simultaneously.

Ports bind to 127.0.0.1. Elasticsearch is limited to 3 GiB with a 1 GiB heap. Colima remains at 4 CPUs and 10 GiB memory.

## Checks with services stopped

Run from the repository root:

~~~sh
npm --prefix web ci --no-audit --no-fund
npm --prefix web run build
docker compose -p docker --env-file docker/.env --env-file docker/.env.local \
  -f docker/docker-compose.yml -f docker/docker-compose.local.yml config --quiet
~~~

Do not print the full resolved Compose configuration: it contains credentials.

## Start only after approval

~~~sh
colima start
docker compose -p docker --env-file docker/.env --env-file docker/.env.local \
  -f docker/docker-compose.yml -f docker/docker-compose.local.yml \
  up -d --wait es01 mysql minio kvrocks nats
docker compose -p docker --env-file docker/.env --env-file docker/.env.local \
  -f docker/docker-compose.yml -f docker/docker-compose.local.yml up -d --no-deps ragflow-cpu
~~~

The existing stopped containers may have restart policies; after starting Colima check container status and memory before proceeding. The application container must be recreated from this directory so its frontend and configuration mounts use the new source path.

Open http://localhost and use a regular workspace account. The system administrator account cannot use the workspace APIs. Verify existing datasets, citations, chat, and provider configuration manually before approving a push.

## Git and automation

Do not stage real credentials, generated frontend output, dependencies, logs, or runtime data. Upstream workflow files are retained under .github/upstream-workflows, outside GitHub's active workflows directory: they depend on upstream self-hosted infrastructure and include scheduled publishing. A separate CI setup can be added deliberately later.

Keep LICENSE and source copyright notices. No push is authorized until manual testing is approved.
