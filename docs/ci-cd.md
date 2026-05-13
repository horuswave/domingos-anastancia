# CI/CD Pipeline

A reproducible pipeline ensures that every commit is linted, tested, and optionally deployed automatically.

## GitHub Actions Example

Create `.github/workflows/ci.yml` in the repository root:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports: [5432:5432]
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install dependencies
        run: npm ci
      - name: Prepare environment
        run: |
          cp .env.example .env
          echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=public" >> .env
      - name: Generate Prisma client
        run: npx prisma generate
      - name: Apply schema
        run: npx prisma db push
      - name: Lint
        run: npm run lint
      - name: Type‑check
        run: npm run typecheck
      - name: Unit tests
        run: npm run test:ci
      - name: End‑to‑end tests
        run: npx playwright test --headless
```

## Optional Deploy Steps
- **Vercel**: Add a `vercel.json` and enable the **Vercel for Git** integration. The workflow above already builds the app (`npm run build`). Vercel will automatically deploy on push to `main`.
- **Docker**: Use the Dockerfile already documented in `docs/deployment.md`. A separate GitHub Action can push the image to Docker Hub:

```yaml
  build-docker:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/invitation-app:latest
```

## Badges
Add CI status badges to the README:
```
[![CI](https://github.com/your-org/invitation-app/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/invitation-app/actions/workflows/ci.yml)
```

---
### When to Extend the Pipeline
- Add **security scanning** (e.g., `npm audit`, `trivy`).
- Enable **performance benchmarks** after each build.
- Introduce **release tagging** for versioned deployments.

This CI/CD configuration gives a solid, production‑ready foundation while staying flexible for future enhancements.
