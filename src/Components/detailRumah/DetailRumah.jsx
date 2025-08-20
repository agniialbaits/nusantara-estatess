import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailRumah.css';
import '../navbar/adminNavbar.css';
import AdminNavbar from '../navbar/AdminNavbar';
function DetailRumah() {
  const { index } = useParams();
  const navigate = useNavigate();
  const dataRumah = JSON.parse(localStorage.getItem('dataRumah')) || [];
  const rumah = dataRumah[parseInt(index)];

  if (!rumah) {
    return <p>Data tidak ditemukan.</p>;
  }

  // Gambar detail dari data atau default
  const detailImages = rumah.gambarDetail ? [rumah.gambarDetail] : ['/hero.png', '/hero.png', '/hero.png', '/hero.png'];

  return (
    <div className="detail-page">
     

      {/* Main Content */}
      <div className="main-content">
        <h1 className="page-title">Detail data rumah</h1>
        
        <div className="detail-container">
          <div className="detail-header">
            <h2>Tambahkan data</h2>
            <p>Tambahkan data untuk menampilkan informasi rumah</p>
          </div>

          <div className="detail-content">
            <AdminNavbar>
        <div className="admin-navbar-container">
          <h1 className="admin-page-title">Admin Dashboard</h1>
        </div>  
      </AdminNavbar>
            {/* Masukkan gambar card */}
            <div className="detail-group">
              <label>Masukkan gambar card</label>
              <div className="card-image-container">
                {rumah.gambar && (
                  <img
                    src={rumah.gambar}
                    alt="Card"
                    className="card-image"
                  />
                )}
              </div>
            </div>

            {/* Masukkan gambar detail */}
            <div className="detail-group">
              <label>Masukkan gambar detail</label>
              <div className="detail-images-grid">
                {detailImages.map((src, i) => (
                  <img key={i} src={src} alt={`Detail ${i}`} className="detail-image" />
                ))}
              </div>
            </div>

            {/* Spesifikasi */}
            <div className="detail-group">
              <label>Spesifikasi</label>
              <div className="detail-text-box">
                <p>{rumah.spesifikasi || 'Tidak ada data spesifikasi'}</p>
              </div>
            </div>

            {/* Fasilitas */}
            <div className="detail-group">
              <label>Fasilitas</label>
              <div className="detail-text-box">
                <p>{rumah.fasilitas || 'Tidak ada data fasilitas'}</p>
              </div>
            </div>

            {/* Lokasi */}
            <div className="detail-group">
              <label>Lokasi</label>
              <div className="detail-text-box">
                <p>{rumah.lokasi || 'Tidak ada data lokasi'}</p>
              </div>
            </div>

            {/* Tipe rumah */}
            <div className="detail-group">
              <label>Tipe rumah</label>
              <div className="detail-text-box">
                <p>{rumah.tipe || 'Tidak ada data tipe'}</p>
              </div>
            </div>

            {/* Harga */}
            <div className="detail-group">
              <label>Harga</label>
              <div className="detail-text-box">
                <p>{rumah.harga || 'Tidak ada data harga'}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="detail-actions">
              <button className="btn-kembali" onClick={() => navigate('/')}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="bottom-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">
              <div className="footer-logo-icon"></div>
              <span className="footer-logo-text">Nusantara Estates</span>
            </div>
          </div>
          <div className="footer-right">
            <ul className="footer-menu">
              <li><a href="/">Beranda</a></li>
              <li><a href="/layanan">Layanan</a></li>
              <li><a href="/kontak">Kontak</a></li>
              <li><a href="/">Beranda</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DetailRumah;
