# Hello World — React + Spring Boot + Kubernetes

A minimal full-stack "Hello World" application.

- **Frontend**: React (Vite) served by nginx, which also proxies `/api/*` to the backend.
- **Backend**: Spring Boot (Java 21) REST API exposing `/api/hello` and `/api/health`.
- **Orchestration**: Kubernetes (KIND) with 2 replicas per service and health probes.

## Layout

```
backend/     Spring Boot app + Dockerfile
frontend/    React app + nginx.conf + Dockerfile
k8s/         Kubernetes manifests + KIND cluster config
deploy.sh    Build images, create cluster, load images, apply manifests
```

## API

| Method | Path          | Description                                   |
|--------|---------------|-----------------------------------------------|
| GET    | `/api/hello`  | Returns a greeting. Optional `?name=` param.  |
| GET    | `/api/health` | Liveness/readiness endpoint.                  |

Example response:

```json
{
  "message": "Hello, World!",
  "service": "helloworld-backend",
  "pod": "helloworld-backend-68b54964db-dc5f2",
  "timestamp": "2026-10-03T05:49:51.450926369Z"
}
```

## Run locally (without Kubernetes)

```bash
# Backend (http://localhost:8080)
cd backend && mvn spring-boot:run

# Frontend (http://localhost:3000, proxies /api to :8080)
cd frontend && npm install && npm run dev
```

## Deploy to Kubernetes (KIND)

Requires Docker, `kind`, and `kubectl`.

```bash
./deploy.sh
```

This builds both images, creates the `helloworld` KIND cluster (mapping host ports
12000 → frontend, 12001 → backend), loads the images, and applies the manifests.

Then:

- Frontend: <http://localhost:12000>
- Backend:  <http://localhost:12001/api/hello>

## Kubernetes resources

| Resource                          | Kind       | Notes                          |
|-----------------------------------|------------|--------------------------------|
| `helloworld-backend`              | Deployment | 2 replicas                     |
| `helloworld-backend`              | Service    | ClusterIP on 8080              |
| `helloworld-backend-nodeport`     | Service    | NodePort 30081                 |
| `helloworld-frontend`             | Deployment | 2 replicas                     |
| `helloworld-frontend`             | Service    | NodePort 30080                 |

## Tests

```bash
cd backend && mvn test
```
