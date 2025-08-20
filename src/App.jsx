import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import DetailsPage from './Pages/details/detailsPage';
import HomePage from './Pages/HomePage';
import ScrollToTop from './Components/ScrollOnTop';
import './index.css';
import MoreGallery from './Components/gallerySection/moregallery';
import ContactAgenPage from './Pages/ContactAgenPage/ContactAgenPage';
import RumahKosongPage from './Components/RumahKosong/RumahKosongPage';
import RumahPage from './Components/rumah/RumahPage';
import ResultPage from './Pages/ResultPage/ResultPage';


import AdminPage from './Pages/adminpage/AdminPage';
import AdminTablePage from './Pages/admintable/AdminTablePage';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import TipeRumahDetail from './Pages/TipeRumahDetail/TipeRumahDetail';


// Context untuk user authentication
export const AuthContext = createContext();

// Hook untuk menggunakan auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk login
  const login = async (username, password) => {
    try {
      console.log('🔄 Attempting login for:', username);
      console.log('🌐 Connecting to:', 'http://localhost:5174/api/login');
      
      const response = await fetch('http://localhost:5174/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        return { 
          success: false, 
          message: `Server error: ${response.status} - ${errorText}` 
        };
      }

      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userEmail', data.user.email);
        
        // Simpan token jika ada
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        console.log('✅ Login successful:', {
          username: data.user.username,
          role: data.user.role,
          isAdmin: data.user.isAdmin
        });
        
        return { success: true, message: data.message };
      } else {
        console.log('❌ Login failed:', data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      
      // Cek jenis error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          message: 'Tidak dapat terhubung ke server. Pastikan server backend berjalan di port 5174.' 
        };
      } else if (error.name === 'SyntaxError') {
        return { 
          success: false, 
          message: 'Server mengembalikan response yang tidak valid.' 
        };
      } else {
        return { 
          success: false, 
          message: `Terjadi kesalahan koneksi: ${error.message}` 
        };
      }
    }
  };

  // Fungsi untuk register dengan auto-login
  const register = async (username, email, password) => {
    try {
      const response = await fetch('http://localhost:5174/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      
      // Jika registrasi berhasil, langsung login otomatis
      if (data.success) {
        console.log('Registration successful, attempting auto-login...');
        
        // Auto-login setelah registrasi berhasil
        const loginResult = await login(username, password);
        
        if (loginResult.success) {
          console.log('Auto-login successful after registration');
          return { 
            success: true, 
            message: 'Registrasi berhasil! Anda telah otomatis login.',
            autoLogin: true 
          };
        } else {
          // Jika auto-login gagal, tetap return success untuk registrasi
          return { 
            success: true, 
            message: 'Registrasi berhasil! Silakan login manual.',
            autoLogin: false 
          };
        }
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
  };

  // Fungsi untuk logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    console.log('User logged out successfully');
  };

  // Force logout semua users saat app dimuat
  useEffect(() => {
    const forceLogoutAllUsers = () => {
      try {
        // Hapus semua data session dari localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        
        // Hapus semua data lain yang mungkin tersimpan
        localStorage.clear();
        
        // Set user ke null
        setUser(null);
        
        console.log('🚪 All users have been logged out');
        console.log('🧹 All localStorage data cleared');
      } catch (error) {
        console.error('Error during force logout:', error);
      } finally {
        setLoading(false);
      }
    };

    forceLogoutAllUsers();
  }, []);

  // Test koneksi database
  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        // Tambahkan timestamp untuk cache busting tanpa header Cache-Control
        const response = await fetch(`http://localhost:5174/api/test-db?t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Koneksi database OK. Hasil:', data.result);
        } else {
          console.error('❌ Gagal koneksi ke database:', data.message);
        }
      } catch (err) {
        console.warn('⚠️ Backend server tidak berjalan atau tidak dapat diakses:', err.message);
        console.log('💡 Untuk menjalankan backend server, gunakan: npm run server');
      }
    };
    
    testDatabaseConnection();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detailsPage" element={<DetailsPage />} />
          <Route path="/semua-gambar" element={<MoreGallery />} />
          <Route path="/contact-agent" element={<ContactAgenPage />} />
          <Route path="/rumah-kosong" element={<RumahKosongPage />} />
          <Route path="/rumah" element={<RumahPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/admin/table" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminTablePage />
            </ProtectedRoute>
          } />
          <Route path="/tipe-rumah/:slug" element={<TipeRumahDetail />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
