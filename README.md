# stage everything you intend to ship
git add -A

git commit -m "release(2025.01): neonatal transport safety platform upgrades" -m "\
### Current (January 2025)
- **Core Dashboard & Monitoring**
  - Medical-style dashboard with real-time unit monitoring
  - Live unit tracking (temperature + vibration) for neonatal transport beds
  - Alert system with severity levels + automatic notifications
  - Role-based access (director, head_nurse, nurse, tech_support, admin)

- **Advanced Analytics & Safety**
  - NEW: Transport Vibration Index (TVI) with standardized analysis + safety ratings
  - NEW: TVI dashboard with charts, trends, safety statistics
  - Automated safety ratings (excellent/good/fair/poor/critical)
  - Real-time risk assessment with actionable recommendations

- **Mobile Measurement System**
  - HIPAA-compliant mobile app for vibration measurement
  - Real-time accelerometer data capture during transport
  - Encrypted storage + retention policies
  - Offline capability

- **Specialized Tools**
  - Personalized Alert Soundscape Generator (custom alert tones)
  - Compatible Items Catalog (equipment compatibility tracking)
  - Transport Partners Integration (hospital + transport coordination)
  - Security monitoring (IP activity tracking + threat detection)

- **Technical Infrastructure**
  - Real-time updates: 30s polling with WebSocket fallback
  - PostgreSQL via Drizzle ORM
  - Modern React (TypeScript, shadcn/ui) frontend
  - Express backend with REST API + session-based auth

### Development History (previous)
- Baseline dashboard with simple temperature/vibration
- Basic alerts + standard web UI
- UI evolution to medical-style (NESTARA purple, Libre Baskerville), responsive
- Security & compliance: HIPAA, stronger encryption, IP monitoring, RBAC
- Mobile PWA, Device Motion API, secure/offline transmission

**Summary:** Transitioned from basic monitoring to a medical-grade neonatal transport safety platform with TVI analytics and a professional clinical interface. All features are integrated and functional.
"

# optional: tag this as a calendar-based release
git tag -a v2025.01 -m "January 2025 release: TVI + medical dashboard + HIPAA mobile"
git push origin HEAD && git push origin v2025.01
