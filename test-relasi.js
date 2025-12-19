// test-relasi.js
const { User, Category } = require('./models');

async function cekRelasi() {
  try {
    // 1. Ambil satu user beserta kategori yang dia minati
    // Pastikan ada User dengan ID 1 di database kamu
    const user = await User.findOne({
      where: { id: 1 }, 
      include: Category // <--- INI KUNCINYA
    });

    if (!user) {
      console.log("User tidak ditemukan. Coba ganti ID-nya.");
      return;
    }

    console.log("=== DATA USER ===");
    console.log(`Nama: ${user.email}`); // atau user.Profile.fullName jika di-include Profile juga
    
    console.log("\n=== KATEGORI YANG DIMINATI ===");
    // Karena Many-to-Many, hasilnya adalah ARRAY di dalam properti 'Categories'
    if (user.Categories && user.Categories.length > 0) {
      user.Categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name}`);
      });
    } else {
      console.log("User ini belum memilih kategori apapun.");
    }

    // Tampilkan data mentah (JSON) biar kelihatan strukturnya
    console.log("\n=== RAW JSON ===");
    console.log(JSON.stringify(user, null, 2));

  } catch (error) {
    console.error("Terjadi Error:", error);
  }
}

cekRelasi();