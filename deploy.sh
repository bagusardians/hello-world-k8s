#!/usr/bin/env bash
# Build images, load them into the KIND cluster, and apply the manifests.
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-helloworld}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Building backend image"
docker build -t helloworld-backend:1.0.0 "$ROOT_DIR/backend"

echo "==> Building frontend image"
docker build -t helloworld-frontend:1.0.0 "$ROOT_DIR/frontend"

echo "==> Creating KIND cluster (if missing)"
if ! kind get clusters | grep -qx "$CLUSTER_NAME"; then
  kind create cluster --config "$ROOT_DIR/k8s/kind-config.yaml"
else
  echo "cluster '$CLUSTER_NAME' already exists"
fi

echo "==> Loading images into cluster"
kind load docker-image helloworld-backend:1.0.0 --name "$CLUSTER_NAME"
kind load docker-image helloworld-frontend:1.0.0 --name "$CLUSTER_NAME"

echo "==> Applying manifests"
kubectl apply -f "$ROOT_DIR/k8s/backend.yaml"
kubectl apply -f "$ROOT_DIR/k8s/frontend.yaml"

echo "==> Waiting for rollout"
kubectl rollout status deployment/helloworld-backend --timeout=180s
kubectl rollout status deployment/helloworld-frontend --timeout=180s

echo
echo "Done. Frontend: http://localhost:12000  Backend: http://localhost:12001/api/hello"
