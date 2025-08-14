git add apps/web apps/api packages/ui
git commit -m "feat(dashboard): medical-style interface with real-time unit monitoring and RBAC"

git add apps/web apps/api
git commit -m "feat(alerts): severity levels with auto notifications for critical conditions"

git add services/analytics apps/web
git commit -m "feat(analytics): introduce Transport Vibration Index (TVI) with safety ratings and risk assessment"

git add apps/web
git commit -m "feat(analytics): TVI dashboard with charts, trends, and safety stats"

git add apps/mobile services/ingest
git commit -m "feat(mobile): HIPAA-compliant vibration measurement app with live accelerometer capture and offline mode"

git add apps/mobile services/security
git commit -m "feat(security): encrypted storage, retention policies, IP activity tracking, and threat detection"

git add apps/web services/integrations
git commit -m "feat(tools): personalized alert soundscape generator + compatible items catalog + transport partners integration"

git add apps/web apps/api packages/db
git commit -m "chore(infra): 30s polling with WebSocket fallback; PostgreSQL via Drizzle ORM; Express REST with session auth; React TS + shadcn/ui"

git add docs CHANGELOG.md
git commit -m "docs: update development history and current feature set"
