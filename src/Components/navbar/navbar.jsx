import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../App';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const isLandingPage = location.pathname === '/';
    const { user, logout } = useAuth();

    useEffect(() => {
        let ticking = false;
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        // Set default active on homepage, clear on other routes
        if (location.pathname === '/') {
            setActiveMenu((prev) => (prev || 'home'));
        } else {
            setActiveMenu('');
        }
    }, [location.pathname]);

    // Close menu if viewport resized to desktop
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const scrollToSection = (sectionId) => {
        try {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } catch (error) {
            console.error('Scroll error:', error);
        }
    };

    const handleLayananClick = (e) => {
        e.preventDefault();
        try {
            if (location.pathname === '/') {
                // Jika di homepage, scroll ke section layanan
                scrollToSection('layanan-kami-section');
                setActiveMenu('layanan');
            } else {
                // Jika di halaman lain, navigasi ke homepage lalu scroll
                navigate('/');
                setTimeout(() => {
                    scrollToSection('layanan-kami-section');
                    setActiveMenu('layanan');
                }, 500); // Increase timeout
            }
        } catch (error) {
            console.error('Navigation error:', error);
            navigate('/');
        }
        setIsMenuOpen(false);
    };

    const handleKontakClick = (e) => {
        e.preventDefault();
        try {
            if (location.pathname === '/') {
                scrollToSection('kontak-section');
                setActiveMenu('kontak');
            } else {
                navigate('/');
                setTimeout(() => {
                    scrollToSection('kontak-section');
                    setActiveMenu('kontak');
                }, 500); // Increase timeout
            }
        } catch (error) {
            console.error('Navigation error:', error);
            navigate('/');
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''} ${isLandingPage ? 'landing' : 'inner'}`}>
            <div className="nav-logo">
                <img src="/logo/logo.png" alt="logo" />
                <NavLink to="/">Nusantara Estates</NavLink>
            </div>
            <ul className="nav-links">
                <li>
                    <NavLink 
                        to="/" 
                        end
                        onClick={(e) => {
                            // Untuk admin, gunakan simple navigation tanpa scroll
                            if (user?.isAdmin && location.pathname !== '/') {
                                e.preventDefault();
                                window.location.href = '/';
                            }
                            setActiveMenu('home');
                        }}
                    >
                        Beranda
                    </NavLink>
                </li>
                <li><a href="#layanan-kami-section" className={activeMenu === 'layanan' ? 'active' : ''} onClick={handleLayananClick}>Layanan</a></li>
                <li><a href="#kontak-section" className={activeMenu === 'kontak' ? 'active' : ''} onClick={handleKontakClick}>Kontak</a></li>
            </ul>
            <div className="nav-buttons">
                {user ? (
                    <div className="user-info">
                        <span className="welcome-text">Halo, {user.username}!</span>
                        {/* Tampilkan tombol Admin Panel hanya untuk admin */}
                        {user.isAdmin && (
                            <button 
                                className="dashboard-btn" 
                                onClick={() => {
                                    try {
                                        navigate('/admin/table');
                                    } catch (error) {
                                        console.error('Navigation error:', error);
                                        window.location.href = '/admin/table';
                                    }
                                }}
                            >
                                Admin Panel
                            </button>
                        )}
                        <button className="logout" onClick={handleLogout}>Keluar</button>
                    </div>
                ) : (
                    <>
                        <button className="login" onClick={handleLogin}>Masuk</button>
                        <button className="register" onClick={handleRegister}>Daftar</button>
                    </>
                )}
            </div>
            {/* Hamburger for mobile */}
            <button
                type="button"
                className={`hamburger${isMenuOpen ? ' active' : ''}`}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((prev) => !prev)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile overlay/backdrop and menu */}
            {isMenuOpen && (
                <>
                    <div className="mobile-backdrop" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="mobile-menu">
                        <button
                            type="button"
                            className="mobile-close"
                            aria-label="Tutup menu"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span></span>
                            <span></span>
                        </button>
                        <ul className='menu'>
                            <li>
                                <NavLink 
                                    // to="/" 
                                    // end
                                    // onClick={(e) => {
                                    //     if (user?.isAdmin && location.pathname !== '/') {
                                    //         e.preventDefault();
                                    //         window.location.href = '/';
                                    //     }
                                    //     setIsMenuOpen(false);
                                    // }}
                                >
                                    Beranda
                                </NavLink>
                            </li>
                            <li><a href="#layanan-kami-section" className={activeMenu === 'layanan' ? 'active' : ''} onClick={handleLayananClick}>Layanan</a></li>
                            <li><a href="#kontak-section" className={activeMenu === 'kontak' ? 'active' : ''} onClick={handleKontakClick}>Kontak</a></li>
                        </ul>
                        <div className="mobile-buttons">
                            {user ? (
                                <>
                                    {user.isAdmin && (
                                        <button 
                                            className="dashboard-btn" 
                                            onClick={() => {
                                                try {
                                                    navigate('/admin/table');
                                                } catch (error) {
                                                    console.error('Navigation error:', error);
                                                    window.location.href = '/admin/table';
                                                }
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            Admin Panel
                                        </button>
                                    )}
                                    <button className="logout" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Keluar</button>
                                </>
                            ) : (
                                <>
                                    <button className="login" onClick={() => { handleLogin(); setIsMenuOpen(false); }}>Masuk</button>
                                    <button className="register" onClick={() => { handleRegister(); setIsMenuOpen(false); }}>Daftar</button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;
