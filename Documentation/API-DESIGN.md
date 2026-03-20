# Desain API

## Informasi Dokumen

| Field | Nilai |
|-------|-------|
| **Proyek** | Scalp Analytics |
| **Base URL** | `/api` |

---

## 1. Gambaran Umum API

### 1.1 Prinsip Desain

| Prinsip | Deskripsi |
|---------|-----------|
| **RESTful** | Mengikuti konvensi REST untuk penamaan resource |
| **Versionless** | Tanpa versi di URL, backward compatible |
| **JSON** | Request/response body dalam format JSON |
| **Stateless** | Tanpa server-side session storage |
| **Secure** | JWT authentication, HTTPS only |

### 1.2 Format Response

#### Response Sukses

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2026-03-20T10:30:00Z",
    "request_id": "abc123"
  }
}
```

#### Response Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-03-20T10:30:00Z",
    "request_id": "abc123"
  }
}
```

### 1.3 Kode Status HTTP

| Kode Status | Arti |
|-------------|------|
| 200 OK | Sukses GET/PUT |
| 201 Created | Sukses POST |
| 204 No Content | Sukses DELETE |
| 400 Bad Request | Validation error |
| 401 Unauthorized | Missing/invalid token |
| 403 Forbidden | Insufficient permissions |
| 404 Not Found | Resource tidak ditemukan |
| 409 Conflict | Duplicate resource |
| 422 Unprocessable Entity | Business logic error |
| 429 Too Many Requests | Rate limit exceeded |
| 500 Internal Server Error | Server error |

---

## 2. Endpoints Autentikasi

### 2.1 Registrasi Pengguna

**POST** `/api/auth/register`

Membuat akun pengguna baru.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe"
}
```

#### Request Schema

| Field | Tipe | Required | Constraint |
|-------|------|----------|------------|
| email | string | Ya | Format email valid |
| password | string | Ya | Min 8 karakter, 1 uppercase, 1 angka |
| full_name | string | Ya | Min 2 karakter, max 100 karakter |

#### Response Sukses (201)

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "full_name": "John Doe",
      "is_active": true,
      "is_verified": false,
      "created_at": "2026-03-20T10:30:00Z"
    }
  }
}
```

#### Response Error

| Status | Kode | Deskripsi |
|--------|------|-----------|
| 400 | VALIDATION_ERROR | Invalid input data |
| 409 | DUPLICATE_EMAIL | Email sudah terdaftar |

---

### 2.2 Login

**POST** `/api/auth/login`

Autentikasi pengguna dan menerima tokens.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 1800
  }
}
```

---

### 2.3 Refresh Token

**POST** `/api/auth/refresh`

Mendapatkan access token baru menggunakan refresh token.

#### Request Body

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 1800
  }
}
```

---

### 2.4 Logout

**POST** `/api/auth/logout`

Menginvalidate sesi saat ini.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (204)

No content returned.

---

### 2.5 OAuth Login (Google)

**GET** `/api/auth/google`

Redirect ke Google OAuth consent screen.

#### Response Sukses (302)

Redirects ke Google OAuth page dengan callback URL.

---

### 2.6 OAuth Callback

**GET** `/api/auth/google/callback`

Handle Google OAuth callback.

#### Query Parameters

| Parameter | Tipe | Required |
|-----------|------|----------|
| code | string | Ya |
| state | string | Ya |

#### Response Sukses (302)

Redirects ke frontend dengan tokens di URL fragment.

---

## 3. Endpoints User

### 3.1 Get Current User

**GET** `/api/users/me`

Mendapatkan profil pengguna yang terautentikasi.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://storage.example.com/avatars/user.jpg",
    "is_active": true,
    "is_verified": true,
    "created_at": "2026-03-20T10:30:00Z",
    "updated_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### 3.2 Update User Profile

**PATCH** `/api/users/me`

Update profil pengguna yang terautentikasi.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "full_name": "John Smith",
  "avatar_url": "https://storage.example.com/avatars/new.jpg"
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Smith",
    "avatar_url": "https://storage.example.com/avatars/new.jpg",
    "updated_at": "2026-03-20T11:00:00Z"
  }
}
```

---

### 3.3 Change Password

**POST** `/api/users/me/change-password`

Mengubah password pengguna.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewSecurePassword456!"
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

---

### 3.4 Delete Account

**DELETE** `/api/users/me`

Menghapus akun pengguna dan semua data terkait.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "password": "SecurePassword123!"
}
```

#### Response Sukses (204)

No content returned.

---

## 4. Endpoints Photo

### 4.1 Upload Photo

**POST** `/api/photos/upload`

Mengunggah foto kulit kepala untuk dianalisis.

#### Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### Request Body (Form Data)

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| file | file | Ya | File gambar (JPEG, PNG, max 10MB) |
| angle | string | Ya | Sudut foto: `front`, `top`, `side` |
| captured_at | datetime | Tidak | Kapan foto diambil (ISO8601) |

#### Response Sukses (201)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "image_url": "https://storage.example.com/photos/front_001.jpg",
    "thumbnail_url": "https://storage.example.com/thumbnails/front_001.jpg",
    "angle": "front",
    "density_percentage": 78.5,
    "confidence_score": 0.92,
    "detected_regions": 1250,
    "captured_at": "2026-03-20T10:30:00Z",
    "created_at": "2026-03-20T10:35:00Z"
  }
}
```

---

### 4.2 Get Photo by ID

**GET** `/api/photos/{photo_id}`

Mengambil foto tertentu.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| photo_id | UUID | Identifier foto |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "image_url": "https://storage.example.com/photos/front_001.jpg",
    "thumbnail_url": "https://storage.example.com/thumbnails/front_001.jpg",
    "angle": "front",
    "density_percentage": 78.5,
    "confidence_score": 0.92,
    "detected_regions": 1250,
    "captured_at": "2026-03-20T10:30:00Z",
    "created_at": "2026-03-20T10:35:00Z"
  }
}
```

---

### 4.3 List Photos

**GET** `/api/photos`

Melihat foto pengguna dengan pagination dan filtering.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| page | int | 1 | Nomor halaman |
| limit | int | 20 | Item per halaman (max 100) |
| angle | string | - | Filter berdasarkan sudut |
| start_date | date | - | Filter dari tanggal |
| end_date | date | - | Filter sampai tanggal |
| sort | string | created_at | Field untuk sort |
| order | string | desc | Urutan sort |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "angle": "front",
        "density_percentage": 78.5,
        "captured_at": "2026-03-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

---

### 4.4 Compare Photos

**GET** `/api/photos/compare`

Membandingkan dua foto secara side-by-side.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Required | Deskripsi |
|-----------|------|----------|-----------|
| photo_id_1 | UUID | Ya | ID foto pertama |
| photo_id_2 | UUID | Ya | ID foto kedua |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "photo_1": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "density_percentage": 75.0,
      "captured_at": "2026-01-20T10:30:00Z"
    },
    "photo_2": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "density_percentage": 78.5,
      "captured_at": "2026-03-20T10:30:00Z"
    },
    "comparison": {
      "density_change": 3.5,
      "percentage_change": 4.67,
      "time_diff_days": 60
    }
  }
}
```

---

### 4.5 Delete Photo

**DELETE** `/api/photos/{photo_id}`

Menghapus foto.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (204)

No content returned.

---

## 5. Endpoints Habit Log

### 5.1 Create Habit Log

**POST** `/api/habits`

Membuat entri log kebiasaan harian.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "log_date": "2026-03-20",
  "stress_level": 5,
  "sleep_hours": 7.5,
  "notes": "Felt productive today"
}
```

#### Request Schema

| Field | Tipe | Required | Constraint |
|-------|------|----------|------------|
| log_date | date | Ya | Tanggal valid, tidak future |
| stress_level | int | Ya | 1-10 |
| sleep_hours | float | Ya | 0-24 |
| notes | string | Tidak | Max 500 karakter |

#### Response Sukses (201)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "log_date": "2026-03-20",
    "stress_level": 5,
    "sleep_hours": 7.5,
    "notes": "Felt productive today",
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### 5.2 Get Habit Log by Date

**GET** `/api/habits/{date}`

Mengambil log kebiasaan untuk tanggal tertentu.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| date | date | Tanggal log (YYYY-MM-DD) |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "log_date": "2026-03-20",
    "stress_level": 5,
    "sleep_hours": 7.5,
    "notes": "Felt productive today"
  }
}
```

---

### 5.3 Update Habit Log

**PATCH** `/api/habits/{date}`

Update log kebiasaan yang sudah ada.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "stress_level": 6,
  "sleep_hours": 8.0,
  "notes": "Updated notes"
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "log_date": "2026-03-20",
    "stress_level": 6,
    "sleep_hours": 8.0,
    "notes": "Updated notes",
    "updated_at": "2026-03-20T12:00:00Z"
  }
}
```

---

### 5.4 List Habit Logs

**GET** `/api/habits`

Melihat log kebiasaan dengan pagination dan filtering.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| start_date | date | - | Filter dari tanggal |
| end_date | date | - | Filter sampai tanggal |
| page | int | 1 | Nomor halaman |
| limit | int | 30 | Item per halaman |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "log_date": "2026-03-20",
        "stress_level": 5,
        "sleep_hours": 7.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 30,
      "total": 90,
      "total_pages": 3
    }
  }
}
```

---

### 5.5 Get Habit Statistics

**GET** `/api/habits/statistics`

Mendapatkan statistik kebiasaan agregat.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| period | string | week | Periode: `week`, `month`, `year` |
| start_date | date | - | Tanggal mulai custom |
| end_date | date | - | Tanggal akhir custom |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "period": "week",
    "stress": {
      "average": 5.2,
      "min": 2,
      "max": 8,
      "trend": "decreasing"
    },
    "sleep": {
      "average": 7.1,
      "min": 5.5,
      "max": 9.0,
      "trend": "stable"
    },
    "entries_count": 7
  }
}
```

---

## 6. Endpoints Treatment

### 6.1 Create Treatment

**POST** `/api/treatments`

Membuat jadwal perawatan baru.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "name": "Minoxidil",
  "dosage": "5% solution",
  "frequency": "daily",
  "description": "Apply to scalp twice daily",
  "schedules": [
    {
      "scheduled_time": "08:00:00",
      "days_of_week": [0, 1, 2, 3, 4, 5, 6]
    },
    {
      "scheduled_time": "20:00:00",
      "days_of_week": [0, 1, 2, 3, 4, 5, 6]
    }
  ]
}
```

#### Response Sukses (201)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Minoxidil",
    "dosage": "5% solution",
    "frequency": "daily",
    "description": "Apply to scalp twice daily",
    "is_active": true,
    "schedules": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "scheduled_time": "08:00:00",
        "days_of_week": [0, 1, 2, 3, 4, 5, 6]
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440006",
        "scheduled_time": "20:00:00",
        "days_of_week": [0, 1, 2, 3, 4, 5, 6]
      }
    ],
    "created_at": "2026-03-20T10:30:00Z"
  }
}
```

---

### 6.2 List Treatments

**GET** `/api/treatments`

Melihat perawatan pengguna.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| is_active | bool | true | Filter berdasarkan status aktif |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "name": "Minoxidil",
        "dosage": "5% solution",
        "frequency": "daily",
        "is_active": true,
        "schedules_count": 2
      }
    ]
  }
}
```

---

### 6.3 Update Treatment

**PATCH** `/api/treatments/{treatment_id}`

Update jadwal perawatan.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "name": "Minoxidil 5%",
  "is_active": false
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Minoxidil 5%",
    "is_active": false,
    "updated_at": "2026-03-20T12:00:00Z"
  }
}
```

---

### 6.4 Delete Treatment

**DELETE** `/api/treatments/{treatment_id}`

Menghapus perawatan dan semua jadwal terkait.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (204)

No content returned.

---

### 6.5 Get Today's Checklist

**GET** `/api/treatments/checklist/today`

Mendapatkan checklist perawatan untuk hari ini.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "date": "2026-03-20",
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440007",
        "schedule_id": "550e8400-e29b-41d4-a716-446655440005",
        "treatment_name": "Minoxidil",
        "dosage": "5% solution",
        "scheduled_time": "08:00:00",
        "completed": true,
        "completed_at": "2026-03-20T08:05:00Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440008",
        "schedule_id": "550e8400-e29b-41d4-a716-446655440006",
        "treatment_name": "Minoxidil",
        "dosage": "5% solution",
        "scheduled_time": "20:00:00",
        "completed": false,
        "completed_at": null
      }
    ],
    "completion_rate": 0.5,
    "current_streak": 7
  }
}
```

---

### 6.6 Mark Treatment Complete

**POST** `/api/treatments/logs/{log_id}/complete`

Menandai log perawatan sebagai selesai.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "completed": true,
    "completed_at": "2026-03-20T20:05:00Z"
  }
}
```

---

### 6.7 Get Treatment Streak

**GET** `/api/treatments/streaks`

Mendapatkan streak penyelesaian perawatan.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "treatments": [
      {
        "treatment_id": "550e8400-e29b-41d4-a716-446655440004",
        "treatment_name": "Minoxidil",
        "current_streak": 7,
        "longest_streak": 30
      }
    ]
  }
}
```

---

## 7. Endpoints Analytics

### 7.1 Get Dashboard Summary

**GET** `/api/analytics/dashboard`

Mendapatkan data dashboard komprehensif.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| period | string | week | Periode: `week`, `month`, `year` |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "period": "week",
    "hair_progress": {
      "current_density": 78.5,
      "previous_density": 75.0,
      "change": 3.5,
      "trend": "improving"
    },
    "habit_summary": {
      "avg_stress": 5.2,
      "avg_sleep": 7.1,
      "stress_trend": "decreasing",
      "sleep_trend": "stable"
    },
    "treatment_compliance": {
      "completion_rate": 0.85,
      "streak": 7,
      "missed_doses": 2
    },
    "insights": [
      {
        "type": "correlation",
        "message": "Lower stress levels correlate with better hair density",
        "confidence": 0.78
      },
      {
        "type": "recommendation",
        "message": "Consider increasing sleep duration to 8 hours"
      }
    ]
  }
}
```

---

### 7.2 Get Correlation Analysis

**GET** `/api/analytics/correlation`

Mendapatkan korelasi antara kebiasaan dan densitas rambut.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| start_date | date | - | Tanggal mulai |
| end_date | date | - | Tanggal akhir |
| metric | string | stress | Metrik: `stress`, `sleep` |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "metric": "stress",
    "correlation_coefficient": -0.72,
    "p_value": 0.001,
    "interpretation": "Strong negative correlation",
    "insight": "Your stress levels have a significant negative impact on hair density",
    "recommendation": "Consider stress management techniques",
    "data_points": [
      {
        "date": "2026-03-13",
        "density": 75.0,
        "stress": 6
      },
      {
        "date": "2026-03-14",
        "density": 76.0,
        "stress": 5
      }
    ]
  }
}
```

---

### 7.3 Get Progress Chart

**GET** `/api/analytics/progress`

Mendapatkan data progres untuk charts.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| start_date | date | - | Tanggal mulai |
| end_date | date | - | Tanggal akhir |
| angle | string | - | Filter berdasarkan sudut |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "photos": [
      {
        "date": "2026-03-01",
        "density": 72.5,
        "angle": "front"
      },
      {
        "date": "2026-03-08",
        "density": 74.0,
        "angle": "front"
      },
      {
        "date": "2026-03-15",
        "density": 75.5,
        "angle": "front"
      },
      {
        "date": "2026-03-20",
        "density": 78.5,
        "angle": "front"
      }
    ],
    "trend_line": {
      "slope": 0.75,
      "intercept": 70.0,
      "r_squared": 0.95
    }
  }
}
```

---

## 8. Endpoints Food & Nutrition

### 8.1 Search Foods

**GET** `/api/foods/search`

Mencari makanan dalam database.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| q | string | - | Query pencarian (min 2 karakter) |
| category | string | - | Filter kategori: protein, vegetable, fruit, grain, dairy, meat, seafood, legume, nut, beverage, other |
| limit | int | 20 | Maksimal hasil (max 50) |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Tempe",
        "category": "legume",
        "default_serving": 100,
        "default_unit": "g",
        "brand": null,
        "nutrients": {
          "protein": {"amount": 19.0, "unit": "g"},
          "zinc": {"amount": 1.0, "unit": "mg"},
          "iron": {"amount": 2.7, "unit": "mg"}
        }
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "name": "Tahu",
        "category": "legume",
        "default_serving": 100,
        "default_unit": "g",
        "brand": null,
        "nutrients": {
          "protein": {"amount": 8.0, "unit": "g"},
          "zinc": {"amount": 0.8, "unit": "mg"},
          "iron": {"amount": 5.4, "unit": "mg"}
        }
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "has_more": true
    }
  }
}
```

---

### 8.2 Get Food Details

**GET** `/api/foods/{food_id}`

Mendapatkan detail makanan dengan informasi nutrisi lengkap.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| food_id | UUID | Identifier makanan |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "name": "Tempe",
    "category": "legume",
    "default_serving": 100,
    "default_unit": "g",
    "brand": null,
    "is_verified": true,
    "nutrients": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "name": "protein",
        "display_name": "Protein",
        "amount": 19.0,
        "unit": "g",
        "daily_value_percentage": 38.0
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440021",
        "name": "zinc",
        "display_name": "Zinc",
        "amount": 1.0,
        "unit": "mg",
        "daily_value_percentage": 9.1
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440022",
        "name": "iron",
        "display_name": "Iron",
        "amount": 2.7,
        "unit": "mg",
        "daily_value_percentage": 15.0
      }
    ]
  }
}
```

---

### 8.3 Get Food Categories

**GET** `/api/foods/categories`

Mendapatkan daftar kategori makanan.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "categories": [
      {"value": "protein", "label": "Protein"},
      {"value": "vegetable", "label": "Sayuran"},
      {"value": "fruit", "label": "Buah"},
      {"value": "grain", "label": "Biji-bijian"},
      {"value": "dairy", "label": "Susu & Produk Susu"},
      {"value": "meat", "label": "Daging"},
      {"value": "seafood", "label": "Makanan Laut"},
      {"value": "legume", "label": "Kacang-kacangan"},
      {"value": "nut", "label": "Kacang Pohon"},
      {"value": "beverage", "label": "Minuman"},
      {"value": "other", "label": "Lainnya"}
    ]
  }
}
```

---

### 8.4 Create Meal Log

**POST** `/api/meals`

Membuat log makanan baru.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Request Body

```json
{
  "log_date": "2026-03-20",
  "log_time": "12:30:00",
  "meal_type": "lunch",
  "notes": "Makan siang di kantor"
}
```

#### Request Schema

| Field | Tipe | Required | Constraint |
|-------|------|----------|------------|
| log_date | date | Ya | Tanggal valid |
| log_time | time | Tidak | Waktu makan (default: now) |
| meal_type | string | Ya | breakfast, lunch, dinner, snack |
| notes | string | Tidak | Max 500 karakter |

#### Response Sukses(201)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "log_date": "2026-03-20",
    "log_time": "12:30:00",
    "meal_type": "lunch",
    "notes": "Makan siang di kantor",
    "items": [],
    "total_nutrition": {},
    "created_at": "2026-03-20T12:30:00Z"
  }
}
```

---

### 8.5 Get Meal Logs

**GET** `/api/meals`

Mendapatkan log makanan dengan pagination.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| log_date | date | - | Filter tanggal tertentu |
| start_date | date | - | Filter dari tanggal |
| end_date | date | - | Filter sampai tanggal |
| meal_type | string | - | Filter tipe makanan |
| page | int | 1 | Nomor halaman |
| limit | int | 20 | Item per halaman |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "log_date": "2026-03-20",
        "log_time": "12:30:00",
        "meal_type": "lunch",
        "notes": "Makan siang di kantor",
        "items": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440031",
            "food_id": "550e8400-e29b-41d4-a716-446655440010",
            "food_name": "Tempe",
            "quantity": 100,
            "unit": "g",
            "nutrients": {
              "protein": 19.0,
              "zinc": 1.0,
              "iron": 2.7
            }
          }
        ],
        "total_nutrition": {
          "protein": {"amount": 19.0, "unit": "g", "daily_value_percentage": 38.0},
          "zinc": {"amount": 1.0, "unit": "mg", "daily_value_percentage": 9.1},
          "iron": {"amount": 2.7, "unit": "mg", "daily_value_percentage": 15.0}
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total":45,
      "total_pages": 3
    }
  }
}
```

---

### 8.6 Add Meal Item

**POST** `/api/meals/{meal_id}/items`

Menambahkan item makanan ke meal log.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| meal_id | UUID | Identifier meal log |

#### Request Body

```json
{
  "food_id": "550e8400-e29b-41d4-a716-446655440010",
  "quantity": 100,
  "unit": "g",
  "serving_multiplier":1.0
}
```

#### Request Schema

| Field | Tipe | Required | Deskripsi |
|-------|------|----------|-----------|
| food_id | UUID | Ya | ID makanan dari database |
| quantity | float | Ya | Jumlah yang dikonsumsi |
| unit | string | Ya | Satuan: g, mangkuk, potong, butir, dll |
| serving_multiplier | float | Tidak | Pengali dari default serving (default: 1.0) |

#### Response Sukses (201)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440031",
    "meal_log_id": "550e8400-e29b-41d4-a716-446655440030",
    "food_id": "550e8400-e29b-41d4-a716-446655440010",
    "food_name": "Tempe",
    "quantity": 100,
    "unit": "g",
    "serving_multiplier": 1.0,
    "nutrients": {
      "protein": {"amount": 19.0, "unit": "g"},
      "zinc": {"amount": 1.0, "unit": "mg"},
      "iron": {"amount": 2.7, "unit": "mg"}
    },
    "created_at": "2026-03-20T12:35:00Z"
  }
}
```

---

### 8.7 Remove Meal Item

**DELETE** `/api/meals/{meal_id}/items/{item_id}`

Menghapus item makanan dari meal log.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| meal_id | UUID | Identifier meal log |
| item_id | UUID | Identifier meal item |

#### Response Sukses (204)

No content returned.

---

### 8.8 Get Daily Nutrition Summary

**GET** `/api/nutrition/daily/{date}`

Mendapatkan ringkasan nutrisi harian.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| date | date | Tanggal (YYYY-MM-DD) |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "date": "2026-03-20",
    "total_nutrition": {
      "protein": {
        "amount": 85.5,
        "unit": "g",
        "daily_value": 50,
        "daily_value_percentage": 171.0
      },
      "zinc": {
        "amount": 12.5,
        "unit": "mg",
        "daily_value": 11,
        "daily_value_percentage": 113.6
      },
      "iron": {
        "amount": 15.2,
        "unit": "mg",
        "daily_value": 18,
        "daily_value_percentage": 84.4
      },
      "biotin": {
        "amount": 25.0,
        "unit": "mcg",
        "daily_value": 30,
        "daily_value_percentage": 83.3
      },
      "vitamin_d": {
        "amount": 450.0,
        "unit": "IU",
        "daily_value": 600,
        "daily_value_percentage": 75.0
      }
    },
    "meals": [
      {
        "meal_type": "breakfast",
        "time": "07:30:00",
        "total_protein": 25.0,
        "total_zinc": 3.5,
        "total_iron": 5.0
      },
      {
        "meal_type": "lunch",
        "time": "12:30:00",
        "total_protein": 38.0,
        "total_zinc": 5.0,
        "total_iron": 6.5
      },
      {
        "meal_type": "dinner",
        "time": "19:00:00",
        "total_protein": 22.5,
        "total_zinc": 4.0,
        "total_iron": 3.7
      }
    ],
    "recommendations": [
      {
        "nutrient": "biotin",
        "message": "Biotin intake is below daily value. Consider adding eggs, almonds, or salmon.",
        "suggested_foods": ["Telur", "Almond", "Salmon"]
      }
    ]
  }
}
```

---

### 8.9 Get Water Intake

**GET** `/api/nutrition/water/{date}`

Mendapatkan asupan air harian.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| date | date | Tanggal (YYYY-MM-DD) |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "date": "2026-03-20",
    "amount_ml": 2500,
    "goal_ml": 3000,
    "percentage": 83.3,
    "glasses": 10,
    "created_at": "2026-03-20T00:00:00Z",
    "updated_at": "2026-03-20T18:30:00Z"
  }
}
```

---

### 8.10 Update Water Intake

**PATCH** `/api/nutrition/water/{date}`

Mengupdate asupan air harian.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Path Parameters

| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| date | date | Tanggal (YYYY-MM-DD) |

#### Request Body

```json
{
  "amount_ml": 2500
}
```

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "date": "2026-03-20",
    "amount_ml": 2500,
    "goal_ml": 3000,
    "percentage": 83.3,
    "updated_at": "2026-03-20T18:30:00Z"
  }
}
```

---

### 8.11 Get Nutrition History

**GET** `/api/nutrition/history`

Mendapatkan riwayat nutrisi dalam periode tertentu.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Query Parameters

| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| start_date | date | - | Tanggal mulai |
| end_date | date | - | Tanggal akhir |
| nutrient | string | - | Filter nutrisi tertentu |
| period | string | week | Periode: day, week, month |

#### Response Sukses (200)

```json
{
  "success": true,
  "data": {
    "period": "week",
    "nutrients": [
      {
        "name": "protein",
        "display_name": "Protein",
        "unit": "g",
        "daily_value": 50,
        "average": 75.5,
        "min": 45.0,
        "max": 95.0,
        "trend": "stable",
        "daily_data": [
          {"date": "2026-03-14", "amount": 72.5},
          {"date": "2026-03-15", "amount": 78.0},
          {"date": "2026-03-16", "amount": 65.5},
          {"date": "2026-03-17", "amount": 82.0},
          {"date": "2026-03-18", "amount": 75.0},
          {"date": "2026-03-19", "amount": 88.5},
          {"date": "2026-03-20", "amount": 85.5}
        ]
      }
    ]
  }
}
```

---

## 10. Rate Limiting

### 10.1 Batas Rate

| Kategori Endpoint | Batas | Window |
|-------------------|-------|--------|
| Authentication | 10 requests | 1 menit |
| Photo Upload | 20 requests | 1 menit |
| Food Search | 50 requests | 1 menit |
| Read Operations | 100 requests | 1 menit |
| Write Operations | 50 requests | 1 menit |

### 10.2 Headers Rate Limit

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1710937200
```

---

## 11. Kode Error

| Kode | Status HTTP | Deskripsi |
|------|-------------|-----------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource tidak ditemukan |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |