# HackQuiz8
HackQuiz8 adalah platform kuis online interaktif yang dirancang untuk mengasah logika, pemahaman teknologi, dan kemampuan problem solving dengan pendekatan ala bootcamp Hacktiv8.

## 🎯 Fitur Utama

### 1️⃣ Sistem Autentikasi
- **Registrasi Pengguna**: Pendaftaran akun dengan role Student atau Teacher
- **Login**: Autentikasi berbasis session dengan bcrypt untuk keamanan password
- **Logout**: Sistem logout yang aman untuk mengakhiri sesi pengguna
- **Validasi**: Email validation, password minimal 8 karakter, dan unique email constraint

### 2️⃣ Role-Based Access Control
- **Student Role**: 
  - Akses ke dashboard student
  - Mengikuti kuis dan latihan
  - Melihat dan mengelola profil pribadi
  - Melihat hasil dan skor latihan
- **Teacher Role**: 
  - Akses ke dashboard teacher dengan middleware authorization
  - Mengelola exercise (CRUD operations)
  - Melihat dan mengelola profil pribadi

### 3️⃣ Manajemen Kursus & Kategori
- **Katalog Kursus**: Tampilan semua kursus yang tersedia di platform
- **Kategori Kursus**: Pengelompokan kursus berdasarkan kategori (e.g., Programming, Database, Framework)
- **Filter by Category**: Navigasi kursus berdasarkan kategori tertentu
- **Search Functionality**: Pencarian kursus berdasarkan nama (case-insensitive)

### 4️⃣ Sistem Exercise & Quiz
- **View Exercises**: Daftar latihan soal berdasarkan course
- **Interactive Quiz**: Interface quiz interaktif untuk student
- **Auto-Grading**: Sistem penilaian otomatis dengan quiz helper
- **Answer Evaluation**: Perbandingan jawaban student dengan answer key (case-insensitive)
- **Score Display**: Tampilan skor dan detail jawaban setelah submit

### 5️⃣ Manajemen Exercise (Teacher Only)
- **Add Exercise**: Membuat exercise baru untuk course tertentu
- **Edit Exercise**: Mengubah exercise yang sudah ada
- **Delete Exercise**: Menghapus exercise (support GET & POST method)
- **Exercise Details**: Pertanyaan dan answer key untuk setiap exercise

### 6️⃣ Sistem Profil Pengguna
- **View Profile**: Tampilan profil lengkap dengan data personal
- **Edit Profile**: Update informasi profil (nama, bio, data personal)
- **Profile Association**: One-to-one relationship antara User dan Profile
- **User Information**: Data lengkap termasuk email dan role

### 7️⃣ Tracking & Scoring
- **Score Recording**: Pencatatan skor setiap exercise yang dikerjakan
- **Score History**: Riwayat skor student per course
- **Performance Details**: Detail jawaban benar/salah untuk setiap soal
- **User-Category Association**: Tracking kategori yang diambil student

## 🛠️ Spesifikasi Teknis

### Database Models & Relasi
- **User**: Email, password (hashed), role
  - hasOne → Profile
  - belongsToMany → Category (through UserCategory)
  
- **Profile**: Name, bio, personal information
  - belongsTo → User

- **Category**: Kategori pembelajaran
  - hasMany → Course
  - belongsToMany → User (through UserCategory)

- **Course**: Kursus pembelajaran
  - belongsTo → Category
  - hasMany → Exercise

- **Exercise**: Soal latihan dengan pertanyaan dan answer key
  - belongsTo → Course

- **Score**: Pencatatan nilai student
  - belongsTo → User
  - belongsTo → Course

- **UserCategory**: Junction table untuk relasi Many-to-Many User-Category

### Teknologi yang Digunakan
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL dengan Sequelize ORM
- **Template Engine**: EJS (Embedded JavaScript)
- **Authentication**: bcryptjs + express-session
- **Styling**: Custom CSS
- **Chart Visualization**: Chart.js (untuk visualisasi data)

### Keamanan
- Password hashing menggunakan bcryptjs (salt rounds: 10)
- Session-based authentication dengan express-session
- Role-based authorization middleware
- Input validation pada model level (Sequelize validators)
- CSRF protection melalui session management
