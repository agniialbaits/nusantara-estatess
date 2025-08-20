import React, { useState, useEffect } from 'react';
import Navbar from '../Components/navbar/navbar';
import './home.css'; 
import Hero from '../Components/hero/hero';
import LayananKami from '../Components/layananKami/LayananKami'
import TipeRumah from '../Components/tiperumah/tipeRumah';
import Footer from '../Components/footer/footer';
import DetailsCs from '../Components/detailcs/detailCs'

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate component mounting delay to prevent race conditions
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Error boundary untuk menangkap error
    const handleError = (error) => {
        console.error('HomePage error:', error);
        setError(error);
    };

    if (error) {
        return (
            <div style={{ 
                padding: '20px', 
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <h2>Terjadi kesalahan</h2>
                <p>Silakan refresh halaman atau coba lagi nanti</p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                fontSize: '18px'
            }}>
                Memuat halaman...
            </div>
        );
    }

    try {
        return (
            <div className="home-page" style={{ margin: 0, padding: 0, width: '100%', overflow: 'hidden' }}>
                <Navbar />
                <Hero />
                <LayananKami />
                <TipeRumah />
                <DetailsCs />
                <Footer />
            </div>
        );
    } catch (error) {
        handleError(error);
        return null;
    }
}

export default HomePage;