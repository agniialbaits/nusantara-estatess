# 🚪 Force Logout All Users - Instructions

## Apa yang Sudah Dilakukan

✅ **Automatic Force Logout**: Aplikasi sekarang secara otomatis akan logout semua users saat pertama kali dimuat.

✅ **Clear All Storage**: Semua data session (localStorage, sessionStorage) akan dihapus otomatis.

✅ **Reset User State**: Semua users akan kembali ke state tidak login.

## Cara Menggunakan

### 1. Otomatis (Sudah Aktif)
- Buka website di `http://localhost:5173/`
- Aplikasi akan otomatis logout semua users
- Semua akan diarahkan ke HomePage tanpa login

### 2. Manual (Jika Diperlukan)
Jika masih ada session yang tersisa, jalankan script ini di browser console:

```javascript
// Copy dan paste script ini ke browser console (F12)
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
window.location.reload();
```

### 3. Menggunakan File Script
Jalankan file `force-logout-all.js` di browser console:
1. Buka Developer Tools (F12)
2. Pergi ke tab Console
3. Copy isi file `force-logout-all.js` dan paste di console
4. Tekan Enter

## Hasil yang Diharapkan

🎯 **Semua users akan:**
- Tidak lagi login dengan account apapun
- Diarahkan ke HomePage saat mengakses website
- Harus login ulang jika ingin mengakses fitur yang memerlukan authentication
- Tidak memiliki session data yang tersimpan

## Verifikasi

Untuk memastikan force logout berhasil:

1. **Cek Console Browser**: Harus muncul pesan:
   ```
   🚪 All users have been logged out
   🧹 All localStorage data cleared
   ```

2. **Cek localStorage**: Buka Developer Tools > Application > Local Storage
   - Harus kosong atau tidak ada data user

3. **Cek Behavior**: 
   - Akses `http://localhost:5173/` → Langsung ke HomePage
   - Akses `http://localhost:5173/admin/table` → Redirect ke login
   - Tidak ada user yang otomatis login

## Catatan Penting

⚠️ **Perubahan Permanen**: Force logout ini akan terjadi setiap kali aplikasi dimuat ulang.

⚠️ **Admin Juga Logout**: Bahkan admin harus login ulang.

⚠️ **Data Aman**: Hanya session data yang dihapus, data di database tetap aman.

## Mengembalikan Behavior Normal

Jika ingin mengembalikan ke behavior normal (cek session), edit file `src/App.jsx` dan ganti:
```javascript
// Force logout semua users saat app dimuat
```
Kembali ke:
```javascript
// Cek apakah user sudah login saat app dimuat
```

Dan restore kode session checking yang asli.