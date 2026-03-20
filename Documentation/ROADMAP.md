# Roadmap Pengembangan

---

## 1. Gambaran Umum

```mermaid
gantt
    title Roadmap Scalp Analytics
    dateFormat YYYY-MM-DD
    section Foundation
    Project Setup           :a1, 2026-01-01, 7d
    Database Design         :a2, after a1, 7d
    Auth System             :a3, after a2, 7d
    section Core Features
    Photo Upload            :b1, after a3, 7d
    AI Model                :b2, after b1, 7d
    Habit Logger            :b3, after b2, 7d
    Treatment Scheduler     :b4, after b3, 7d
    section Analytics
    Correlation Engine      :c1, after b4, 7d
    Dashboard UI            :c2, after c1, 7d
    section Polish
    Testing                 :d1, after c2, 7d
    Docker Deployment       :d2, after d1, 7d
```

---

## 2. Branch Strategy

```mermaid
gitGraph
    commit id: "initial"
    branch development
    checkout development
    commit id: "feature-1"
    commit id: "feature-2"
    checkout main
    merge development id: "release-1"
    checkout development
    commit id: "feature-3"
    checkout main
    merge development id: "release-2"
```

| Branch | Keterangan |
|--------|------------|
| main | Production-ready code |
| development | Active development |

---

## 3. Sprint Breakdown

### Sprint 1: Fondasi

```mermaid
flowchart LR
    A[Project Init] --> B[DB Design]
    B --> C[Auth System]
    C --> D[User CRUD]
    D --> E[Frontend Setup]
```

#### Deliverables

| Komponen | Status |
|----------|--------|
| Project Structure | Pending |
| Database Schema | Pending |
| Auth Endpoints | Pending |
| User Management | Pending |
| Frontend Setup | Pending |

---

### Sprint 2: Frontend Foundation

```mermaid
flowchart LR
    A[Next.js Setup] --> B[Auth Pages]
    B --> C[Dashboard Layout]
    C --> D[API Integration]
```

#### Deliverables

| Komponen | Status |
|----------|--------|
| Auth Flow | Pending |
| Protected Routes | Pending |
| Dashboard Layout | Pending |
| API Client | Pending |

---

### Sprint 3: Photo dan AI

```mermaid
flowchart LR
    A[Upload Feature] --> B[AI Model]
    B --> C[Gallery]
    C --> D[Results Display]
    D --> E[Scalp Type Detection]
```

#### Deliverables

| Komponen | Status |
|----------|--------|
| Photo Upload | Pending |
| Density Model | Pending |
| Scalp Type Model | Pending |
| Photo Gallery | Pending |
| Analysis Display | Pending |

---

### Sprint 4: Habit dan Treatment

```mermaid
flowchart LR
    A[Habit Logger] --> B[Nutrition Tracker]
    B --> C[Treatment Scheduler]
    C --> D[Daily Checklist]
    D --> E[Streak Tracking]
```

#### Deliverables

| Komponen | Status |
|----------|--------|
| Habit CRUD | Pending |
| Nutrition CRUD | Pending |
| Treatment CRUD | Pending |
| Checklist Logic | Pending |
| Streak System | Pending |

---

### Sprint 5: Analytics dan Recommendation

```mermaid
flowchart LR
    A[Correlation Engine] --> B[Risk Scoring]
    B --> C[Charts]
    C --> D[Dashboard]
    D --> E[Product Recommendations]
    E --> F[Content Recommendations]
```

#### Deliverables

| Komponen | Status |
|----------|--------|
| Correlation Logic | Pending |
| Risk Scoring | Pending |
| Chart Components | Pending |
| Dashboard Integration | Pending |
| Recommendation Engine | Pending |

---

### Sprint 6: Polish dan Deploy

```mermaid
flowchart LR
    A[Tests] --> B[Docker]
    B --> C[CI/CD]
    C --> D[Production]
```

#### Deliverables

| Komponen | Status |
|----------|--------|
| Unit Tests | Pending |
| Integration Tests | Pending |
| Docker Setup | Pending |
| CI/CD Pipeline | Pending |

---

## 4. Milestones

```mermaid
graph LR
    subgraph M1[Milestone 1: Auth Ready]
        A1[User Registration]
        A2[Email Verification]
        A3[Login/Logout]
        A4[Profile Management]
    end
    
    subgraph M2[Milestone 2: AI Ready]
        B1[Upload Photos]
        B2[Density Analysis]
        B3[Scalp Type Detection]
        B4[Photo Gallery]
    end
    
    subgraph M3[Milestone 3: Core Ready]
        C1[Habit Logging]
        C2[Nutrition Tracking]
        C3[Treatment Scheduler]
        C4[Correlation Dashboard]
    end
    
    subgraph M4[Milestone 4: MVP Ready]
        D1[All Features]
        D2[Product Recommendations]
        D3[Content Recommendations]
        D4[Tests Passing]
    end
    
    M1 --> M2 --> M3 --> M4
```

---

## 5. Definition of Done

Task dianggap selesai ketika:

- Code mengikuti style guide
- Unit tests ditulis dan passing
- Code review selesai
- Dokumentasi diupdate
- Tidak ada critical bugs
- Acceptance criteria terpenuhi

---

## 6. Dependencies

```mermaid
graph LR
    A[PostgreSQL] --> E[Backend]
    B[FastAPI] --> E
    C[Next.js] --> F[Frontend]
    D[OpenCV] --> G[AI]
    E --> H[Application]
    F --> H
    G --> H
```

---

## 7. Risk Mitigation

| Risiko | Mitigasi |
|--------|----------|
| Security issues | Security audit, penetration testing |
| AI accuracy low | Multiple validation datasets |
| Photo quality issues | Validation, compression, guidelines |
| Performance bottlenecks | Load testing, query optimization |
| Recommendation relevance | Feedback loop, user ratings |