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
import apiService from './services/api';
import { login as authLogin, saveAuthToken } from './services/authService';
import { httpFetch } from './services/httpClient';

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

  // Fungsi untuk login (gunakan authService + http client)
  const login = async (username, password) => {
    try {
      console.log('🔄 Attempting login for:', username);

      const data = await authLogin({ username, password });
      console.log('📦 Response data:', data);

      if (data?.success) {
        setUser(data.user);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userEmail', data.user.email);

        if (data.token) {
          saveAuthToken(data.token);
          localStorage.setItem('authToken', data.token);
        }

        console.log('✅ Login successful:', {
          username: data.user.username,
          role: data.user.role,
          isAdmin: data.user.isAdmin
        });

        return { success: true, message: data.message };
      }

      const message = data?.message || 'Login gagal.';
      console.log('❌ Login failed:', message);
      return { success: false, message };
    } catch (error) {
      console.error('💥 Login error:', error);
      // Pesan koneksi yang ramah saat dev tapi juga cocok untuk prod
      if (error?.status) {
        return { success: false, message: `Server error: ${error.status} - ${error.message}` };
      }
      return { success: false, message: 'Tidak dapat terhubung ke server. Silakan coba lagi beberapa saat.' };
    }
  };

  // Fungsi untuk register dengan auto-login (gunakan http client)
  const register = async (username, email, password) => {
    try {
      const data = await httpFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      if (data?.success) {
        console.log('Registration successful, attempting auto-login...');
        const loginResult = await login(username, password);
        if (loginResult.success) {
          console.log('Auto-login successful after registration');
          return { success: true, message: 'Registrasi berhasil! Anda telah otomatis login.', autoLogin: true };
        }
        return { success: true, message: 'Registrasi berhasil! Silakan login manual.', autoLogin: false };
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      if (error?.status) {
        return { success: false, message: `Server error: ${error.status} - ${error.message}` };
      }
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

  // Test koneksi database (gunakan base URL dari env via http client)
  useEffect(() => {
    const testDatabaseConnection = async () => {
      try {
        const data = await httpFetch(`/test-db?t=${Date.now()}`);
        if (data?.success) {
          console.log('✅ Koneksi database OK. Hasil:', data.result);
        } else {
          console.error('❌ Gagal koneksi ke database:', data?.message || 'Unknown error');
        }
      } catch (err) {
        console.warn('⚠️ Backend tidak dapat diakses:', err?.message || err);
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
