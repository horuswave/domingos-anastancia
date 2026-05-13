# Testing Strategy

A solid test suite protects the Invitation App from regressions and gives confidence when extending features.

## 1. Unit Tests (Jest)

- **Location**: `tests/unit/`
- **Focus**: Pure functions (e.g., helpers in `lib/`, Prisma query builders, guards).
- **Typical command**:
  ```bash
  npm run test            # runs Jest in watch mode
  npm run test:ci        # one‑off CI run (no watch)
  ```
- **Setup**: Jest is pre‑configured with `ts-jest`. Ensure `jest.config.ts` includes:
  ```ts
  export default {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1",
    },
  };
  ```
- **Sample test** (example for `lib/guards.ts`):
  ```ts
  import { requireEventAccess } from "@/lib/guards";
  
  test("throws when admin tries to access another event", async () => {
    const session = { user: { id: "admin1", isSuperAdmin: false, eventId: "eventA" } } as any;
    await expect(
      requireEventAccess(session, "eventB")
    ).rejects.toThrow(/unauthorized/);
  });
  ```

## 2. Integration / API Tests (Playwright)

- **Location**: `tests/e2e/`
- **Purpose**: Verify end‑to‑end flows – login, invitation sending, RSVP submission, table assignment.
- **Run**:
  ```bash
  npx playwright test      # runs all e2e specs
  npx playwright test --debug   # interactive debugging
  ```
- **Typical spec** (login + RSVP):
  ```ts
  import { test, expect } from "@playwright/test";

  test("admin can log in and view dashboard", async ({ page }) => {
    await page.goto("http://localhost:3000/admin/login");
    await page.fill("input[name=\"email\"]", "admin@example.com");
    await page.fill("input[name=\"password\"]", "secret");
    await page.click("button[type=\"submit\"]");
    await expect(page).toHaveURL("/admin");
  });
  ```

## 3. Continuous Integration

Add the following steps to your CI workflow (GitHub Actions example below). This ensures every PR runs the full test suite before merging.

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
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
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - name: Set up .env for tests
        run: |
          cp .env.example .env
          echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=public" >> .env
      - name: Generate Prisma client
        run: npx prisma generate
      - name: Run migrations (sqlite in CI is also fine)
        run: npx prisma db push
      - name: Run unit tests
        run: npm run test:ci
      - name: Run e2e tests
        run: npx playwright test --headless
```

## 4. Linting & Type Checking

- `npm run lint` – runs ESLint with the project’s rule set.
- `npm run typecheck` – runs `tsc --noEmit` to ensure type safety.

**Keep the test suite up‑to‑date**: whenever you add a new feature or modify a model, add corresponding unit and (if relevant) e2e tests.
