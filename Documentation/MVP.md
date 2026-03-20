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
    C -->|Samping| D
    D --> E[Ambil atau Pilih Foto]
    E --> F[Proses AI]
    F --> G[Tampilkan Hasil]
    G --> H{Lihat Galeri?}
    H -->|Ya| I[Galeri Foto]
    H -->|Tidak| J[Dashboard]
```

#### Spesifikasi

| Aspek | Spesifikasi |
|-------|-------------|
| Sudut Foto | Depan, Atas, Samping (3 sudut wajib) |
| Format Foto | JPEG, PNG (max 10MB) |
| Resolusi | Minimum 720p |
| Waktu Proses | Kurang dari 30 detik |
| Penyimpanan | Terenkripsi |

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

## 3. Fitur Lanjutan (Phase 2)

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
    end
    
    subgraph AI
        I[Density Model]
        J[Scalp Type Model]
        K[Risk Scoring]
    end
    
    subgraph Data
        L[(PostgreSQL)]
        M[Redis]
        N[Storage]
    end
    
    subgraph External
        O[YouTube API]
        P[Marketplace API]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    D --> I
    D --> J
    E --> K
    C --> L
    D --> L
    E --> L
    F --> L
    G --> P
    H --> O
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