# AGENTS.md

## Project

Hello World full-stack demo: React (Vite) frontend + Spring Boot (Java 21) backend, deployed to Kubernetes via KIND.

## Environment notes

- Base image is Debian 13 (trixie). `openjdk-17-*` is NOT available; use `openjdk-21-jdk-headless` and Maven via apt.
- Docker daemon is not started automatically. Start with `sudo nohup dockerd >/tmp/dockerd.log 2>&1 &`, then `sudo chmod 666 /var/run/docker.sock`.
- `kind` and `kubectl` are not preinstalled. Install to `/usr/local/bin`:
  - kind: `curl -Lo kind https://kind.sigs.k8s.io/dl/v0.24.0/kind-linux-amd64`
  - kubectl: `curl -Lo kubectl https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl`
- `KUBECONFIG` is `/home/openhands/.kube/config` after `kind create cluster`.

## Build / test / deploy

- Backend build + tests: `cd backend && mvn clean package`
- Frontend build: `cd frontend && npm install && npm run build`
- Full deploy: `./deploy.sh` (build images, create cluster, load images, apply manifests)

## Conventions

- Backend package root: `com.example.helloworld`. Config via `application.properties`.
- Frontend calls the backend through the relative `/api` path; nginx proxies `/api/` to the `helloworld-backend` Service in-cluster, and Vite proxies it to `localhost:8080` in dev.
- Kubernetes manifests live in `k8s/`. NodePorts: frontend 30080, backend 30081, mapped to host ports 12000/12001 via the KIND config.
