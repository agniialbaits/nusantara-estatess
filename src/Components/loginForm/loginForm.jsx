import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './loginForm.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.username || !formData.password) {
            setError('Username dan password harus diisi');
            setLoading(false);
            return;
        }

        try {
            const result = await login(formData.username, formData.password);
            
            if (result.success) {
                // Redirect berdasarkan role user
                const userRole = localStorage.getItem('userRole');
                if (userRole === 'admin') {
                    navigate('/admin/table');
                } else {
                    navigate('/');
                }
            } else {
                setError(result.message || 'Login gagal');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Terjadi kesalahan saat login');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-title">
                        <img src="/logo/logo.png" alt="logo" />
                        <h1>Selamat Datang Kembali</h1>
                        <p>Masukkan username dan password Anda dengan benar untuk mengakses akun Anda secara aman.</p>
                    </div>
                    
                    {error && (
                        <div className="error-message" style={{
                            color: 'red',
                            backgroundColor: '#ffebee',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            border: '1px solid #ffcdd2'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="username">Username atau Email</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Masukkan username atau email Anda" 
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Masukkan password Anda" 
                            required
                        />
                        <a href="#" onClick={(e) => e.preventDefault()}>Lupa Password?</a>
                    </div>
                    <div className="actions">
                        <button 
                            type="submit" 
                            className="btn-login" 
                            disabled={loading}
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                        
                        <Link to="/register" className='daftar'>Belum punya akun? Daftar disini</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm