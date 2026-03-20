# Minimum Viable Product (MVP) Scope

---

## 1. MVP Overview

### 1.1 Definisi MVP

MVP berfokus pada pengiriman proposisi nilai inti dengan fitur minimal yang diperlukan untuk memvalidasi product-market fit.

### 1.2 Kriteria Sukses

| Kriteria | Target | Pengukuran |
|----------|--------|------------|
| Aktivasi Pengguna | 80% menyelesaikan onboarding | Analytics |
| Retensi Mingguan | 40% kembali setelah minggu 1 | Analytics |
| Kepatuhan Unggah Foto | 70% unggah mingguan | Database |
| Kepatuhan Perawatan | 60% penyelesaian harian | Database |

---

## 2. Fitur Inti (Must Have)

### 2.1 AI Hair Density Tracker

#### Alur Pengguna

```mermaid
flowchart TD
    A[Buka Aplikasi] --> B[Navigasi ke Upload]
    B --> C{Pilih Sudut}
    C -->|Depan| D[Kamera atau Galeri]
    C -->|Atas| D
    C -->|Kanan| D
    C -->|Kiri| D
    C -->|Custom Spot| E[Label Area Botak]
    E --> D
    D --> F[Ambil atau Pilih Foto]
    F --> G[Proses AI]
    G --> H[Hitung Density]
    H --> I[Klasifikasi Severity]
    I --> J[Tampilkan Hasil]
    J --> K{Lihat Galeri?}
    K -->|Ya| L[Galeri Foto]
    K -->|Tidak| M[Dashboard]
```

#### Spesifikasi

| Aspek | Spesifikasi |
|-------|-------------|
| Sudut Foto | Depan, Atas, Kanan, Kiri, Custom Spot (5 sudut) |
| Format Foto | JPEG, PNG, WebP (max 10MB) |
| Resolusi | Minimum 720p, Maximum 4K |
| Waktu Proses | Kurang dari 30 detik |
| Penyimpanan | Terenkripsi |

#### Batasan Upload Foto

| Limit | Nilai | Deskripsi |
|-------|-------|-----------|
| Ukuran File Maksimal | 10 MB | Sebelum kompresi |
| Ukuran Setelah Kompresi | 500 KB - 2 MB | Target optimal |
| Foto Per Sudut | 1 foto | Hanya foto terbaru per sudut |
| Total Foto Aktif | 25 foto | 5 sudut x 5 histori |
| Histori Tersimpan | 5 per sudut | Foto lama otomatis diarsipkan |
| Storage Limit | 500 MB | Batas per pengguna |

#### Kompresi Gambar

| Parameter | Nilai | Alasan |
|-----------|-------|--------|
| Target Size | 500 KB - 2 MB | Balance ukuran dan kualitas |
| JPEG Quality | 85% | Cukup untuk AI training |
| Max Width | 1920px | Deteksi detail optimal |
| Max Height | 1920px | Maintain aspect ratio |
| Thumbnail Size | 300x300 | Preview cepat |
| Thumbnail Quality | 70% | Ukuran kecil untuk list |
| Metadata Strip | Ya | Hapus data sensitif |

```mermaid
flowchart TD
    A[Upload Photo 10MB] --> B{Validasi}
    B -->|Fail| C[Reject]
    B -->|Pass| D{Size > 2MB?}
    
    D -->|Ya| E[Resize ke 1920px]
    D -->|Tidak| F{Resolution > 1920px?}
    
    E --> G[JPEG Quality 85%]
    F -->|Ya| H[Resize ke 1920px]
    F -->|Tidak| I[Keep Original]
    
    G --> J[Strip Metadata]
    H --> J
    I --> J
    
    J --> K[Generate Thumbnail]
    K --> L{AI Compatible?}
    L -->|Ya| M[Save Compressed 1.5MB]
    L -->|Tidak| N[Adjust Quality]
    N --> G
    
    M --> O[Upload Complete]
```

#### Akurasi AI Setelah Kompresi

| Metric | Original | Compressed | Impact |
|--------|----------|------------|--------|
| File Size | 10 MB | 1.5 MB | -85% |
| Resolution | 4000x3000 | 1920x1440 | Maintain aspect ratio |
| Quality | 100% | 85% | Still AI-compatible |
| AI Accuracy | N/A | 98% | Same as uncompressed |
| Processing Time | 5s | 2s | Faster |

#### Sudut Foto yang Didukung

| Sudut | Kode | Deskripsi | Tujuan |
|-------|------|-----------|--------|
| Depan | `front` | Foto dari depan wajah | Analisis garis rambut depan |
| Atas | `top` | Foto dari atas kepala | Analisis vertex/crown area |
| Kanan | `right` | Foto sisi kanan kepala | Analisis temporal right |
| Kiri | `left` | Foto sisi kiri kepala | Analisis temporal left |
| Custom Spot | `custom` | Foto area yang mengalami kebotakan | Analisis area botak spesifik |

#### Klasifikasi Severity (Norwood Scale)

| Stage | Density | Deskripsi | Rekomendasi |
|-------|---------|-----------|-------------|
| Stage 0 | >85% | No Hair Loss | Preventive care |
| Stage 1-2 | 70-85% | Minimal Hair Loss | Monitoring + preventif |
| Stage 3-4 | 50-70% | Moderate Hair Loss | Treatment aktif (Minoxidil) |
| Stage 5-6 | 30-50% | Advanced Hair Loss | Treatment intensif |
| Stage 7 | <30% | Severe Hair Loss | Konsultasi medis/transplant |

#### Alur Severity Classification

```mermaid
flowchart TD
    A[Photo Analysis Complete] --> B[Calculate Density]
    B --> C{Density Percentage}
    C -->|>85%| D[Stage0: No Hair Loss]
    C -->|70-85%| E[Stage 1-2: Minimal]
    C -->|50-70%| F[Stage 3-4: Moderate]
    C -->|30-50%| G[Stage 5-6: Advanced]
    C -->|<30%| H[Stage 7: Severe]
    D --> I[Rekomendasi Preventif]
    E --> J[Monitoring + Treatment Awal]
    F --> K[Treatment Aktif]
    G --> L[Treatment Intensif]
    H --> M[Konsultasi Medis]
```

---

### 2.2 AI Scalp Type Analyzer

#### Alur Analisis

```mermaid
flowchart TD
    A[Foto Close-up] --> B[Texture Analysis]
    B --> C[CNN Classification]
    C --> D{Hasil Klasifikasi}
    D -->|Oily| E[Kulit Kepala Berminyak]
    D -->|Dry| F[Kulit Kepala Kering]
    D -->|Dandruff| G[Ketombe atau Dermatitis]
    E --> H[Rekomendasi Shampo Oil Control]
    F --> I[Rekomendasi Moisturizing Product]
    G --> J[Rekomendasi Anti-Dandruff Shampoo]
```

#### Klasifikasi Tipe Kulit Kepala

| Tipe | Karakteristik | Rekomendasi |
|------|---------------|-------------|
| Oily Scalp | Produksi sebum berlebih, kulit mengkilap | Shampo oil control, clay mask |
| Dry Scalp | Kulit kering, gatal, mengelupas | Moisturizing shampoo, hair oil |
| Dandruff | Ketombe, iritasi, kemerahan | Ketoconazole shampoo, anti-dandruff tonic |

#### Manfaat

| Analisis | Insight |
|----------|---------|
| Deteksi kondisi kulit kepala | Identifikasi penyebab kebotakan |
| Rekomendasi personal | Produk yang sesuai kondisi |
| Tracking progress | Pantau perubahan kondisi |

---

### 2.3 Habit Logger

#### Alur Pengguna

```mermaid
flowchart TD
    A[Buka Aplikasi] --> B[Dashboard]
    B --> C{Sudah Log?}
    C -->|Belum| D[Form Logging]
    C -->|Sudah| E[Lihat atau Edit]
    D --> F[Input Stres 1-10]
    F --> G[Input Tidur]
    G --> H[Input Air]
    H --> I[Input Nutrisi]
    I --> J[Tambah Notes?]
    J -->|Ya| K[Input Notes]
    J -->|Tidak| L[Simpan]
    K --> L
    L --> M[Update Analytics]
```

#### Spesifikasi Input

| Faktor | Tipe Input | Rentang | Frekuensi |
|--------|------------|---------|-----------|
| Tingkat Stres | Slider | 1-10 | Harian |
| Durasi Tidur | Number | 0-24 jam | Harian |
| Asupan Air | Number | 0-5 liter | Harian |
| Protein Intake | Number | gram | Harian |
| Zinc Intake | Number | mg | Harian |
| Notes | Text (Optional) | Max 500 karakter | Harian |

---

### 2.4 Correlation Dashboard

#### Arsitektur Visualisasi

```mermaid
graph TB
    subgraph Input
        A[Data Foto]
        B[Data Habit]
        C[Data Nutrisi]
    end
    
    subgraph Processing
        D[Correlation Engine]
        E[Risk Scoring]
        F[Pattern Recognition]
    end
    
    subgraph Output
        G[Grafik Densitas]
        H[Grafik Stres]
        I[Grafik Nutrisi]
        J[Risk Score]
        K[Insight]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    F --> J
    F --> K
```

#### Logika Insight

| Analisis | Output |
|----------|--------|
| Stres vs Kepadatan | Korelasi dan rekomendasi stress management |
| Tidur vs Kepadatan | Korelasi dan rekomendasi sleep hygiene |
| Nutrisi vs Kepadatan | Korelasi dan rekomendasi diet |
| Total Risk Score | Prediksi risiko kebotakan |

---

### 2.5 Treatment Scheduler

#### Entity Relationship

```mermaid
erDiagram
    USER ||--o{ TREATMENT : has
    TREATMENT ||--o{ SCHEDULE : has
    SCHEDULE ||--o{ TREATMENT_LOG : generates
    
    USER {
        uuid id PK
        string email UK
        string full_name
    }
    
    TREATMENT {
        uuid id PK
        uuid user_id FK
        string name
        string dosage
        string frequency
    }
    
    SCHEDULE {
        uuid id PK
        uuid treatment_id FK
        time scheduled_time
        array days_of_week
    }
    
    TREATMENT_LOG {
        uuid id PK
        uuid schedule_id FK
        date log_date UK
        boolean completed
    }
```

---

### 2.6 Smart Product Recommendation

#### Alur Rekomendasi

```mermaid
flowchart TD
    A[AI Analysis] --> B[Condition Detection]
    B --> C{Kondisi Terdeteksi}
    C -->|Oily Scalp| D[Oil Control Products]
    C -->|Dry Scalp| E[Moisturizing Products]
    C -->|Dandruff| F[Anti-Dandruff Products]
    C -->|Hair Loss| G[Hair Loss Products]
    D --> H[Product Catalog]
    E --> H
    F --> H
    G --> H
    H --> I[Personalized Recommendations]
    I --> J[Product Details]
    J --> K[Affiliate Link atau Marketplace]
```

#### Katalog Produk

| Kondisi | Rekomendasi |
|---------|-------------|
| Oily Scalp | Shampo oil control, Clay mask, Toner |
| Dry Scalp | Moisturizing shampoo, Hair oil, Serum |
| Dandruff | Ketoconazole shampoo, Anti-dandruff tonic |
| Hair Loss | Minoxidil, Hair tonic, Biotin supplement |
| General | Hair vitamins, Protein supplements |

---

### 2.7 Content Recommendation

#### Tipe Konten

| Kategori | Contoh Konten | Sumber |
|----------|---------------|--------|
| Video Edukasi | Cara mengatasi kebotakan | YouTube API |
| Motivasi | Success story | Internal DB |
| Stress Management | Teknik relaksasi | YouTube API |
| Jurnal/Artikel | Penelitian rambut | Internal DB |

#### Alur Konten

```mermaid
flowchart TD
    A[User Condition] --> B[Content Matcher]
    B --> C{Match Content}
    C -->|Hair Loss| D[Videos tentang treatment]
    C -->|Stress| E[Videos stress management]
    C -->|Nutrition| F[Articles tentang diet]
    C -->|Motivation| G[Success stories]
    D --> H[Rekomendasi List]
    E --> H
    F --> H
    G --> H
```

---

### 2.8 Notification System

#### Alur Notifikasi

```mermaid
flowchart TD
    A[Trigger Event] --> B[Notification Service]
    B --> C{Check Preferences}
    C --> D[Build Notification]
    D --> E{Channel Enabled?}
    
    E -->|Push| F[FCM/APNs]
    E -->|Email| G[Email Service]
    E -->|In-App| H[Database]
    
    F --> I[Device Push]
    G --> J[User Email]
    H --> K[Notification Bell]
    
    I --> L[User Notification]
    J --> L
    K --> L
    
    L --> M{User Action}
    M -->|Read| N[Mark as Read]
    M -->|Dismiss| O[Remove Notification]
    M -->|Click| P[Navigate to Target]
```

#### Tipe Notifikasi

| Tipe | Trigger | Contoh Pesan |
|------|---------|--------------|
| Photo Reminder | Scheduled time | "Waktunya foto mingguan untuk tracking progress" |
| Treatment Reminder | Schedule time | "Jangan lupa aplikasikan Minoxidil pagi ini" |
| Progress Milestone | AI detection | "Selamat! Densitas rambut naik 2% bulan ini" |
| Habit Streak | Consecutive days | "Keren! 7 hari konsisten log habit" |
| Risk Alert | Risk score change | "Tingkat stres tinggi terdeteksi, pantau kondisi" |
| Weekly Report | Scheduled | "Laporan mingguan: 5 foto diupload, 90% compliance" |
| Tips Recommendation | AI suggestion | "Tips hari ini: Tidur 8 jam untuk rambut sehat" |

#### Channel Notifikasi

| Channel | Implementasi | Use Case |
|---------|--------------|----------|
| Push Notification | Firebase Cloud Messaging (FCM), APNs | Reminder, Alert |
| Email | SMTP atau SendGrid | Weekly report, Milestone |
| In-App | Real-time WebSocket or Polling | Activity feed |

#### Preferensi Notifikasi

| Setting | Default | Deskripsi |
|---------|---------|-----------|
| photo_reminder | true | Pengingat foto mingguan |
| treatment_reminder | true | Pengingat treatment harian |
| progress_milestone | true | Notifikasi pencapaian |
| habit_streak | true | Notifikasi streak habit |
| risk_alert | true | Alert perubahan risiko |
| weekly_report | true | Laporan mingguan via email |
| tips_recommendation | true | Tips harian |
| push_enabled | true | Enable push notification |
| email_enabled | true | Enable email notification |

#### Notification Preferences Entity

```mermaid
erDiagram
    USER ||--|| NOTIFICATION_PREFERENCES : has
    
    NOTIFICATION_PREFERENCES {
        uuid id PK
        uuid user_id FK UK
        boolean photo_reminder
        boolean treatment_reminder
        boolean progress_milestone
        boolean habit_streak
        boolean risk_alert
        boolean weekly_report
        boolean tips_recommendation
        boolean push_enabled
        boolean email_enabled
        timestamp created_at
        timestamp updated_at
    }
```

#### Notification Status Flow

```mermaid
stateDiagram-v2
    [*] --> Pending: Trigger Created
    Pending --> Sent: Send Success
    Pending --> Failed: Send Failed
    Failed --> Pending: Retry
    Sent --> Delivered: Delivery Confirmed
    Delivered --> Read: User Opened
    Delivered --> Dismissed: User Dismissed
    Read --> [*]
    Dismissed --> [*]
```

#### Spesifikasi Timeline Notifikasi

| Event | Timing | Template ID |
|-------|--------|-------------|
| Photo Reminder | Weekly, user-selected day & time | photo_reminder_weekly |
| Treatment Reminder | Daily, per treatment schedule | treatment_reminder_daily |
| Progress Milestone | On detection | progress_milestone |
| Habit Streak | On streak achievement | habit_streak_7days |
| Risk Alert | On risk score change | risk_alert_high |
| Weekly Report | Sunday 10:00 AM | weekly_report |

---

## 3. Fitur Tambahan

### 3.1 Genetic & Lifestyle Risk Scoring

#### Alur Risk Scoring

```mermaid
flowchart TD
    A[Kuesioner] --> B[Input Data]
    B --> C[Weight Calculation]
    C --> D[Score Computation]
    D --> E[Risk Level]
    E -->|High| F[Intensive Monitoring]
    E -->|Medium| G[Regular Check]
    E -->|Low| H[Preventive Care]
```

#### Faktor Risk Scoring

| Faktor | Bobot | Kuesioner |
|--------|-------|-----------|
| Riwayat Keluarga | 30% | Apakah ayah/kakek botak? |
| Merokok | 15% | Kebiasaan merokok |
| Diet | 15% | Asupan protein |
| Stress | 20% | Tingkat stres harian |
| Sleep | 10% | Kualitas tidur |
| UV Exposure | 10% | Penggunaan topi/helmet |

### 3.2 Community Progress Sharing

#### Fitur Komunitas

| Fitur | Deskripsi |
|-------|-----------|
| Anonymous Sharing | Upload progres tanpa identitas |
| Progress Gallery | Galeri progres komunitas |
| Tips Exchange | Berbagi tips dan pengalaman |
| Reaction | Dukungan dari komunitas |

---

## 4. Arsitektur Sistem

### 4.1 High-Level

```mermaid
graph TB
    subgraph Frontend
        A[Next.js App]
    end
    
    subgraph Backend
        B[FastAPI]
        C[Auth Service]
        D[Photo Service]
        E[Habit Service]
        F[Treatment Service]
        G[Recommendation Service]
        H[Content Service]
        I[Notification Service]
    end
    
    subgraph AI
        J[Density Model]
        K[Scalp Type Model]
        L[Risk Scoring]
    end
    
    subgraph Data
        M[(PostgreSQL)]
        N[Redis]
        O[Storage]
    end
    
    subgraph External
        P[YouTube API]
        Q[Marketplace API]
        R[FCM/APNs]
        S[Email Service]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    D --> J
    D --> K
    E --> L
    C --> M
    D --> M
    E --> M
    F --> M
    I --> M
    G --> Q
    H --> P
    I --> R
    I --> S
```

### 4.2 Alur Data

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API
    participant AI as AI Service
    participant DB as Database
    participant EXT as External API
    
    U->>F: Upload Photo
    F->>API: POST /photos/upload
    API->>DB: Save Metadata
    API->>AI: Analyze
    AI->>AI: Process Image
    AI->>AI: Detect Scalp Type
    AI->>API: Return Results
    API->>EXT: Get Recommendations
    EXT->>API: Return Products/Content
    API->>DB: Save Results
    API->>F: Response
    F->>U: Display Results
```

---

## 5. Database Schema

### 5.1 ERD Utama

```mermaid
erDiagram
    USER ||--o{ PHOTO : uploads
    USER ||--o{ HABIT_LOG : creates
    USER ||--o{ TREATMENT : owns
    USER ||--o{ NUTRITION_LOG : records
    USER ||--o{ RECOMMENDATION : receives
    TREATMENT ||--o{ SCHEDULE : has
    SCHEDULE ||--o{ TREATMENT_LOG : generates
    
    USER {
        uuid id PK
        string email UK
        string full_name
        boolean is_active
    }
    
    PHOTO {
        uuid id PK
        uuid user_id FK
        string image_url
        string angle
        float density_percentage
        string scalp_type
        float confidence_score
    }
    
    HABIT_LOG {
        uuid id PK
        uuid user_id FK
        date log_date UK
        int stress_level
        float sleep_hours
        float water_intake
    }
    
    NUTRITION_LOG {
        uuid id PK
        uuid user_id FK
        date log_date UK
        float protein_intake
        float zinc_intake
    }
    
    RECOMMENDATION {
        uuid id PK
        uuid user_id FK
        string type
        string content
        json metadata
    }
```

---

## 6. Testing Strategy

### 6.1 Coverage Target

| Komponen | Target |
|----------|--------|
| Services | 80% |
| Utils | 90% |
| Components | 70% |

### 6.2 Test Types

| Tipe | Framework | Lokasi |
|------|-----------|--------|
| Unit | pytest / Vitest | Beside source |
| Integration | pytest-asyncio / Playwright | tests/ folder |
| E2E | Playwright | tests/e2e/ |

---

## 7. Risk Assessment

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|--------------|--------|----------|
| Akurasi AI Rendah | Sedang | Tinggi | Multiple angles, feedback loop |
| Masalah Kualitas Foto | Tinggi | Sedang | Kompresi, validasi, panduan |
| Kekhawatiran Privasi | Sedang | Tinggi | Enkripsi, kebijakan jelas |
| Engagement Rendah | Sedang | Tinggi | Gamifikasi, komunitas |
| Rekomendasi Tidak Relevan | Sedang | Sedang | Feedback loop, rating |

---

## 8. Success Metrics Dashboard

| Metrik | Tool | Frekuensi |
|--------|------|-----------|
| Daily Active Users | Analytics | Harian |
| Photo Upload Rate | Database | Mingguan |
| Treatment Compliance | Database | Harian |
| User Retention | Analytics | Mingguan |
| Error Rate | Logging | Real-time |
| API Latency | Monitoring | Real-time |
| Recommendation CTR | Analytics | Mingguan |
| Community Engagement | Analytics | Mingguan |