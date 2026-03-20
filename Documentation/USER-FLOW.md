# User Flow Document

---

## 1. Gambaran Umum

### 1.1 Persona Pengguna

| Persona | Deskripsi | Tujuan Utama |
|---------|-----------|--------------|
| Pengguna Baru | Pengguna pertama kali | Pahami value, onboarding cepat |
| Pengguna Aktif | Pengguna rutin tracking | Logging harian, foto mingguan |
| Pengguna Analitik | Mencari insight | Lihat korelasi, tren data |
| Pengguna Perawatan | Dengan regimen perawatan | Lacak kepatuhan, streak |

### 1.2 Core User Flows

```mermaid
mindmap
  root((User Flows))
    Registrasi
      Landing Page
      Form Registrasi
      Verifikasi Email
      Setup Profil
    Habit Logging
      Dashboard
      Input Stres
      Input Tidur
      Input Air
      Input Nutrisi
      Food Database
    Photo Upload
      Pilih Sudut
      Capture / Gallery
      Preview
      Analisis AI
      Rekomendasi
    Treatment Management
      Buat Treatment
      Set Jadwal
      Checklist Harian
      Streak Tracking
    Analytics Dashboard
      Progress Chart
      Korelasi Data
      Risk Score
      Rekomendasi
```

---

## 2. Flow Registrasi dan Onboarding

### 2.1 Flow Registrasi

```mermaid
flowchart TD
    A[Landing Page] --> B[Klik Get Started]
    B --> C{Sudah Punya Akun?}
    C -->|Ya| D[Login]
    C -->|Tidak| E[Form Registrasi]

    E --> F[Input Email]
    F --> G[Input Password]
    G --> H[Input Nama]
    H --> I[Klik Register]

    I --> J{Validasi OK?}
    J -->|Tidak| K[Tampilkan Error]
    K --> E

    J -->|Ya| L[Kirim Email Verifikasi]
    L --> M[Cek Inbox]
    M --> N[Klik Link Verifikasi]
    N --> O[Setup Profil]

    O --> P[Input Usia]
    P --> Q[Pilih Tipe Rambut]
    Q --> R[Set Goals]
    R --> S[Kuesioner Genetik]
    S --> T[Dashboard Tour]
    T --> U[Dashboard Home]

    D --> V{Validasi OK?}
    V -->|Tidak| W[Tampilkan Error]
    W --> D
    V -->|Ya| U
```

### 2.2 Wireframe Registrasi

#### Layar Registrasi

```mermaid
flowchart LR
    subgraph Form
        direction TB
        A[Email Input]
        B[Password Input]
        C[Nama Lengkap]
        D[Buat Akun Button]
        E[Link Login]
    end
```

| Field | Tipe | Placeholder | Validasi |
|-------|------|-------------|----------|
| Email | email | user@example.com | Format email valid |
| Password | password | ••••••••••| Min 8 karakter |
| Nama Lengkap | text | John Doe | Min 3 karakter |

#### Layar Setup Profil

| Field | Tipe | Options |
|-------|------|---------|
| Usia | dropdown | 18-65 |
| Tipe Rambut | radio button | Lurus, Keriting, Bergelombang |
| Tujuan | checkbox | Cegah kebotakan, Tingkatkan pertumbuhan, Pertahankan kondisi |

---

## 3. Flow Habit Logging

### 3.1 Flow Logging Harian

```mermaid
flowchart TD
    A[Buka Aplikasi] --> B[Dashboard]
    B --> C{Sudah Log Hari Ini?}

    C -->|Belum| D[Tampilkan Prompt]
    C -->|Sudah| E[Tampilkan Status]

    D --> F[Buka Form Logging]
    E --> G{Edit Data?}
    G -->|Ya| F
    G -->|Tidak| H[Lihat History]

    F --> I[Input Tingkat Stres 1-10]
    I --> J[Input Jam Tidur]
    J --> K[Input Asupan Air]
    K --> L[Input Nutrisi dari Makanan]

    L --> M{Tambah Makanan?}
    M -->|Ya| N[Cari / Pilih Makanan]
    N --> O[Pilih Porsi]
    O --> P[Hitung Nutrisi Otomatis]
    P --> Q{Tambah Lagi?}
    Q -->|Ya| N
    Q -->|Tidak| R[Review Data]
    M -->|Tidak| R

    R --> S{Tambah Notes?}
    S -->|Ya| T[Input Notes]
    S -->|Tidak| U[Review Final]
    T --> U

    U --> V{Konfirmasi?}
    V -->|Tidak| F
    V -->|Ya| W[Submit Log]

    W --> X[Update Database]
    X --> Y[Update Analytics]
    Y --> Z[Update Recommendations]
    Z --> AA[Tampilkan Success]
    AA --> AB[Dashboard Updated]

    H --> AC[Pilih Tanggal]
    AC --> AD[Edit atau Delete]
    AD --> AE{Konfirmasi?}
    AE -->|Ya| AF[Update Data]
    AE -->|Tidak| H
    AF --> AB
```

### 3.2 Flow Nutrisi Tracking

```mermaid
flowchart TD
    A[Input Nutrisi] --> B{Mode Input}
    B -->|Manual| C[Input Protein Manual]
    B -->|Food Database| D[Buka Food Database]

    C --> E[Input Gram]
    E --> F[Simpan]

    D --> G[Ketik Nama Makanan]
    G --> H[Search Food API]
    H --> I[Tampilkan Hasil Pencarian]

    I --> J{Pilih Makanan}
    J --> K[Tampilkan Info Nutrisi]
    K --> L[Pilih Ukuran Porsi]

    L --> M[Hitung Nutrisi Otomatis]
    M --> N[Tambahkan ke Log]

    N --> O[Update Total Nutrisi]
    O --> P{Tambah Makanan Lain?}
    P -->|Ya| D
    P -->|Tidak| Q[Review Summary]

    Q --> R[Simpan Log]
```

### 3.3 Wireframe Form Habit

#### Layar Utama Log Habit

| Section | Komponen | Tipe |
|---------|----------|------|
| Header | Title + Date | Text |
| Stres | Rating Scale | Radio/Slider |
| Tidur | Slider | Range 0-24 |
| Air | Slider | Range 0-5L |
| Nutrisi | Food Picker | Button + List |
| Notes | Textarea | Text |
| Action | Submit Button | Button |

#### Layar Food Database Picker

```mermaid
flowchart LR
    subgraph FoodPicker
        direction TB
        A[Search Bar]
        B[Kategori Chips]
        C[Hasil Pencarian]
        D[Selected Items]
        E[Konfirmasi Button]
    end
```

| Komponen | Deskripsi |
|----------|-----------|
| Search Bar | Input untuk cari makanan |
| Kategori Chips | Filter: Protein, Sayuran, Buah, dll |
| Hasil Pencarian | List makanan dengan nutrisi info |
| Selected Items | Daftar makanan yang dipilih |
| Konfirmasi | Button untuk menambahkan ke log |

#### Contoh Data Makanan

| Makanan | Porsi | Protein | Zinc | Iron | Biotin | Vitamin D |
|---------|-------|---------|------|------|--------|------------|
| Tempe | 100g | 19g | 1.0mg | 2.7mg | 0mcg | 0IU |
| Bayam | 1 mangkuk | 3g | 0.5mg | 6.4mg | 0mcg | 0IU |
| Telur | 1 butir | 6g | 0.5mg | 1mg | 10mcg | 41IU |
| Salmon | 100g | 25g | 0.6mg | 0.8mg | 5mcg | 526IU |
| Almond | 28g | 6g | 0.9mg | 1mg | 1.5mcg | 0IU |
| Buncis | 100g | 9g | 1.5mg | 3mg | 0mcg | 0IU |

---

## 4. Flow Photo Upload dan Analisis

### 4.1 Flow Upload Foto

```mermaid
flowchart TD
    A[Dashboard] --> B[Klik Upload Foto]
    B --> C[Pilih Sudut]

    C --> D{Sudut Tersedia}
    D -->|Front| E[Set Mode Front]
    D -->|Top| F[Set Mode Top]
    D -->|Side| G[Set Mode Side]

    E --> H[Buka Kamera / Galeri]
    F --> H
    G --> H

    H --> I{Pilih Source}
    I -->|Kamera| J[Capture Photo]
    I -->|Galeri| K[Pilih dari Galeri]

    J --> L[Preview Foto]
    K --> L

    L --> M{Foto OK?}
    M -->|Tidak| N[Retry]
    N --> H

    M -->|Ya| O[Validasi Foto]
    O --> P{Validasi OK?}
    P -->|Tidak| Q[Tampilkan Error]
    Q --> H

    P -->|Ya| R[Compress Foto]
    R --> S[Upload ke Server]
    S --> T[Tampilkan Progress]

    T --> U{Upload Complete}
    U -->|Gagal| V[Tampilkan Error]
    V --> H

    U -->|Sukses| W[Queue Analisis AI]
    W --> X[Tampilkan Status Processing]
    X --> Y[AI Processing]

    Y --> Z[Hasil Analisis]
    Z --> AA[Deteksi Tipe Kulit Kepala]
    AA --> AB[Generate Rekomendasi]
    AB --> AC{Sudah Upload Semua Sudut?}

    AC -->|Tidak| AD[Tampilkan Sudut Belum Upload]
    AD --> C

    AC -->|Ya| AE[Dashboard dengan Rekomendasi]
```

### 4.2 Wireframe Hasil Analisis

#### Layar Hasil Analisis

| Komponen | Data | Deskripsi |
|----------|------|-----------|
| Thumbnail | Image | Preview foto yang diupload |
| Hair Density | Percentage | Kepadatan rambut (0-100%) |
| Scalp Type | Label | Tipe kulit kepala |
| Confidence | Percentage | Akurasi prediksi AI |
| Recommendations | List | Produk yang disarankan |
| Comparison | Diff | Perbandingan dengan foto sebelumnya |

#### Layar Pilih Sudut Foto

| Sudut | Status | Preview |
|-------|--------|---------|
| Front | Belum/Sudah | Thumbnail jika sudah |
| Top | Belum/Sudah | Thumbnail jika sudah |
| Side | Belum/Sudah | Thumbnail jika sudah |

---

## 5. Flow Treatment Management

### 5.1 Flow Buat Treatment

```mermaid
flowchart TD
    A[Halaman Treatment] --> B[Klik Tambah Treatment]
    B --> C[Form Nama Treatment]

    C --> D[Input Nama]
    D --> E[Input Dosis]
    E --> F[Pilih Frekuensi]

    F --> G{Frekuensi}
    G -->|Harian| H[Set Waktu]
    G -->|Mingguan| I[Pilih Hari]
    G -->|Custom| J[Set Jadwal Custom]

    H --> K[Add Multiple Times]
    I --> K
    J --> K

    K --> L{Tambah Waktu Lain?}
    L -->|Ya| M[Tambah Schedule]
    M --> K
    L -->|Tidak| N[Preview Treatment]

    N --> O{Konfirmasi?}
    O -->|Tidak| C
    O -->|Ya| P[Save Treatment]

    P --> Q[Generate Daily Checklists]
    Q --> R[Tampilkan Success]
    R --> S[Redirect ke Treatment List]
```

### 5.2 Flow Checklist Harian

```mermaid
flowchart TD
    A[Buka Aplikasi] --> B[Dashboard]
    B --> C{Ada Jadwal Hari Ini?}

    C -->|Tidak| D[Tampilkan No Treatment]
    C -->|Ya| E[Load Checklist]

    E --> F[Item 1: Morning Treatment]
    F --> G{Sudah Complete?}

    G -->|Sudah| H[Tampilkan Checkmark]
    G -->|Belum| I[Tampilkan Button Complete]

    H --> J[Item 2: Evening Treatment]
    I --> J

    J --> K{Sudah Complete?}
    K -->|Sudah| L[Checkmark]
    K -->|Belum| M[Button Complete]

    L --> N{Semua Complete?}
    M --> N

    N -->|Ya| O[Update Streak]
    N -->|Tidak| P[Tampilkan Progress]

    O --> Q[Tampilkan Celebration]
    Q --> R[Dashboard dengan Streak Updated]
    P --> R
```

### 5.3 Wireframe Checklist Treatment

#### Layar Checklist

| Komponen | Tipe | Deskripsi |
|----------|------|-----------|
| Treatment Name | Text | Nama treatment |
| Schedule Time | Time | Waktu jadwal |
| Status | Checkbox | Selesai/belum |
| Complete Button | Button | Tandai selesai |
| Progress Bar | Visual | Persentase penyelesaian |
| Streak Badge | Badge | Hari berturut-turut |

#### Layar Tambah Treatment

| Field | Tipe | Options |
|-------|------|---------|
| Nama Treatment | text | Minoxidil 5% |
| Dosis | text | 1 ml |
| Frekuensi | radio | Harian, Mingguan, Custom |
| Jadwal | checkbox | Sen-Sen |
| Waktu | time picker | 08:00 |

---

## 6. Flow Dashboard dan Analytics

### 6.1 Flow Dashboard

```mermaid
flowchart TD
    A[Login Success] --> B[Load Dashboard]

    B --> C[Fetch User Data]
    C --> D[Fetch Today Tasks]
    D --> E[Fetch Photo Data]
    E --> F[Fetch Habit Data]
    F --> G[Fetch Nutrition Data]
    G --> H[Fetch Treatment Data]

    H --> I[Calculate Analytics]
    I --> J[Calculate Risk Score]
    J --> K[Generate Insights]

    K --> L[Render Dashboard]

    L --> M{Quick Stats Section}
    M --> N[Hair Growth Percent]
    M --> O[Treatment Streak]
    M --> P[Compliance Rate]
    M --> Q[Stress Average]
    M --> R[Nutrition Score]

    L --> S{Progress Chart Section}
    S --> T[Render Line Chart]
    T --> U[Show Trends]

    L --> V{Today Tasks}
    V --> W[Tampilkan Checklist]

    L --> X{Insights Section}
    X --> Y[Tampilkan Correlations]
    Y --> Z[Tampilkan Recommendations]
```

### 6.2 Wireframe Dashboard

#### Layar Dashboard Utama

| Section | Komponen | Data |
|---------|----------|------|
| Header | Welcome + Avatar | Nama pengguna |
| Quick Stats | 4 Cards | Growth, Streak, Compliance, Risk |
| Progress Chart | Line Chart | Trend kepadatan |
| Today Tasks | Checklist | Task harian |
| Insights | Cards | AI insights |
| Recommendations | List | Produk, video, artikel |

#### Layar Statistik Detail

| Tab | Content |
|-----|---------|
| Minggu | Data 7 hari terakhir |
| Bulan | Data 30 hari terakhir |
| 3 Bulan | Data 90 hari terakhir |
| 6 Bulan | Data 180 hari terakhir |

| Chart | Data Source |
|-------|-------------|
| Hair Density | Photo analysis results |
| Stress Correlation | Habit logs |
| Nutrition Intake | Food logs |
| Risk Score Breakdown | Genetic + Lifestyle |

---

## 7. Flow Konten dan Rekomendasi

### 7.1 Flow Rekomendasi

```mermaid
flowchart TD
    A[AI Analysis Complete] --> B[Condition Detected]
    B --> C{Scalp Type}

    C -->|Oily| D[Get Oil Control Products]
    C -->|Dry| E[Get Moisturizing Products]
    C -->|Dandruff| F[Get Anti-Dandruff Products]
    C -->|Normal| G[Get Maintenance Products]

    D --> H[Get Stress Videos]
    E --> H
    F --> H
    G --> H

    H --> I[Get Nutrition Articles]
    I --> J[Get Motivation Content]
    J --> K[Compile Recommendations]
    K --> L[Display to User]

    L --> M{User Clicks Product?}
    M -->|Ya| N[Open Marketplace Link]
    M -->|Tidak| O[Stay in App]

    L --> P{User Clicks Video?}
    P -->|Ya| Q[Open YouTube Link]
    P -->|Tidak| O

    L --> R{User Clicks Article?}
    R -->|Ya| S[Open Article]
    R -->|Tidak| O
```

### 7.2 Kategorisasi Konten

| Trigger | Product Category | Video Category | Article Category |
|---------|------------------|----------------|------------------|
| Hair Loss | Minoxidil, Supplements | Treatment tutorials | Hair care tips |
| Oily Scalp | Oil control shampoo | Scalp care videos | Sebum management |
| Dry Scalp | Moisturizing products | Hydration tips | Scalp nourishment |
| High Stress | Relaxation products | Stress management | Mental health |
| Low Nutrition | Supplements | Diet tips | Nutrition guide |

---

## 8. Flow Komunitas (Phase 2)

### 8.1 Flow Sharing

```mermaid
flowchart TD
    A[User Progress] --> B[Anonymize Data]
    B --> C{Share to Community?}
    C -->|Ya| D[Select Progress Data]
    D --> E[Remove Personal Info]
    E --> F[Generate Anonymous ID]
    F --> G[Post to Community]
    G --> H[Community Feed]

    H --> I[Other Users View]
    I --> J{React or Comment?}
    J -->|React| K[Add Reaction]
    J -->|Comment| L[Add Tip/Comment]
    K --> M[Update Engagement]
    L --> M
```

---

## 9. Error States

### 9.1 Error Handling

| Error Code | Message | Action |
|------------|---------|--------|
| 400 | Bad Request | Tampilkan validation error |
| 401 | Unauthorized | Redirect ke login |
| 403 | Forbidden | Tampilkan access denied |
| 404 | Not Found | Tampilkan empty state |
| 500 | Server Error | Tampilkan retry button |
| NETWORK | Connection Failed | Tampilkan offline mode |

### 9.2 Empty State

| Condition | Message | CTA |
|-----------|---------|-----|
| No Photos | Belum ada foto yang diupload | Upload Foto |
| No Treatments | Belum ada treatment | Tambah Treatment |
| No Logs | Belum ada log hari ini | Log Habit |
| No History | Belum ada history | Start Tracking |

### 9.3 Loading State

| Loading | Progress | Message |
|---------|----------|---------|
| Photo Upload | 0-100% | Mengupload foto... |
| AI Analysis | Indeterminate | Menganalisis foto... |
| Data Sync | Indeterminate | Menyinkronkan data... |
| Dashboard Load | Indeterminate | Memuat dashboard... |

---

## 10. Navigation Structure

### 10.1 Bottom Navigation

| Tab | Icon | Label | Description |
|-----|------|-------|-------------|
| Home | Bar Chart | Dashboard | Statistik, task, insight |
| Photo | Camera | Upload | Upload dan analisis foto |
| Treatment | Pill | Treatment | Checklist dan jadwal |
| Profile | User | Profile | Pengaturan akun |

### 10.2 Screen Hierarchy

```mermaid
graph TD
    subgraph Auth
        A[Landing] --> B[Login]
        A --> C[Register]
        B --> D[Forgot Password]
    end

    subgraph Main
        E[Dashboard] --> F[Photo Upload]
        E --> G[Habit Log]
        E --> H[Treatment]
        E --> I[Recommendations]
        E --> K[Profile]
    end

    F --> L[Photo Gallery]
    F --> M[Analysis Result]

    G --> N[Habit History]
    G --> O[Food Picker]

    H --> P[Treatment List]
    H --> Q[Checklist]

    I --> R[Products]
    I --> S[Videos]
    I --> T[Articles]
```

### 10.3 Header Navigation

| Page | Back Button | Actions |
|------|-------------|---------|
| Dashboard | No | Notification, Settings |
| Photo Upload | Yes | Gallery |
| Treatment | Yes | Add Treatment |
| Profile | No | Edit, Logout |
| Settings | Yes | Save |

---

## 11. Key Success Metrics

| Metrik | Target | Pengukuran |
|--------|--------|-------------|
| Penyelesaian Hari 1 | 80% | Complete onboarding |
| Retensi Minggu 1 | 60% | Return after 7 days |
| Kepatuhan Foto | 70% | Weekly photo uploads |
| Kepatuhan Treatment | 70% | Daily completion |
| Engagement Insight | 50% | View correlation data |
| Click Rate Rekomendasi | 30% | Click on products/videos |
| Nutrition Logging | 60% | Daily food logging |

---

## 12. Food Database Specification

### 12.1 Data Source

| Source | Coverage | Update Frequency |
|--------|----------|-------------------|
| USDA Food Database | Global | Monthly |
| Indonesian Food Data | Local | Quarterly |
| User Submissions | Community | Real-time |

### 12.2 Nutrient Categories

| Kategori | Nutrisi | Satuan |
|----------|---------|--------|
| Macro | Protein | gram |
| Macro | Karbohidrat | gram |
| Macro | Lemak | gram |
| Micro | Zinc | mg |
| Micro | Iron | mg |
| Micro | Biotin | mcg |
| Micro | Vitamin D | IU |
| Micro | Vitamin B12 | mcg |
| Micro | Vitamin E | mg |
| Hydration | Water | ml |

### 12.3 Portion Sizes

| Makanan | Porsi Standar | Gram |
|---------|---------------|------|
| Tempe | 1 potong | 100g |
| Bayam | 1 mangkuk | 180g |
| Telur | 1 butir | 50g |
| Nasi | 1 centong | 150g |
| Ayam | 1 potong | 100g |
| Ikan | 1 potong | 100g |

---

## 13. Future Enhancements

### 13.1 Phase 2 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Community Sharing | Share progress anonymously | High |
| Nutrition AI | Smart food recognition from photo | Medium |
| Wearable Integration | Sync with fitness trackers | Medium |
| Teleconsultation | Chat with dermatologist | Low |

### 13.2 Phase 3 Features

| Feature | Description | Priority |
|---------|-------------|----------|
| Genetic Test Integration | Import DNA test results | High |
| Marketplace | Buy recommended products | Medium |
| Gamification | Points and achievements | Medium |
| Family Profiles | Multiple user profiles | Low |