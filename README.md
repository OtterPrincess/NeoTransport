Title: January 2025 Release — TVI analytics, medical dashboard, HIPAA mobile, infra hardening

What’s new

Medical-style dashboard with live unit monitoring and RBAC

TVI (Transport Vibration Index) + TVI Dashboard (charts, trends, safety stats)

Automated safety ratings; real-time risk assessment with recommendations

HIPAA-compliant mobile measurement app (live accelerometer, encrypted storage, offline)

Personalized alert soundscapes, compatibility catalog, transport partners integration

Security monitoring (IP activity + threat detection)

Infra: 30-second polling with WS fallback; PostgreSQL + Drizzle; Express REST; React TS + shadcn/ui

Why it matters
Elevates the platform from “monitoring” to a medical-grade neonatal transport safety system with standardized vibration analytics, clinical UX, and compliant mobile capture.

Testing/verification

Dashboard: simulate unit data streams; verify severity alerts and role gating

TVI: run sample transports; confirm rating thresholds and risk outputs

Mobile: record offline session → sync; confirm encryption + retention policy

Security: confirm IP logging and detection events propagate to alerts

Infra: throttle WS to test polling fallback

Backward compatibility
No breaking API changes expected. Existing devices and users remain functional.

Rollout

Tag: v2025.01

Migrations: ensure Drizzle migrations applied; confirm session secrets and retention envs set.
