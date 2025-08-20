import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import Navbar from '../../Components/navbar/navbar';

const AdminPage = () => {
  const [dataRumah, setDataRumah] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem('dataRumah')) || [];
    
    
    if (data.length === 0) {
      data = [
        {
          gambar: '/hero.png',
          gambarDetail: '/hero.png',
          spesifikasi: '3 kamar tidur, 2 kamar mandi, Luas bangunan 120m2',
          fasilitas: 'Carport, Taman belakang, Ruang tamu, Dapur modern',
          lokasi: 'Jalan Angkasa, Sumedang, Jawa Barat',
          tipe: 'Modern',
          harga: 'Rp 1.400.000.000'
        }
      ];
      localStorage.setItem('dataRumah', JSON.stringify(data));
    }
    
    setDataRumah(data);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  const handleTambahData = () => {
    navigate('/input-data');
  };

  const handleHapusClick = (index) => {
    setIndexToDelete(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIndexToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (indexToDelete !== null) {
      const updated = [...dataRumah];
      updated.splice(indexToDelete, 1);
      setDataRumah(updated);
      localStorage.setItem('dataRumah', JSON.stringify(updated));
    }
    setShowModal(false);
  };

  const handleDetailClick = (index) => {
    navigate(`/detail/${index}`);
  };

  const handleEditClick = (index) => {
    navigate(`/input-data?edit=${index}`);
  };

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-header">
        <div className="admin-navbar-container">
          <h1 className="admin-page-title">Admin Dashboard</h1>
        </div>  
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Tambah Data Button */}
        <div className="tambah-data-section">
          <button className="tambah-data-btn" onClick={handleTambahData}>
            Tambah data
          </button>
        </div>

        {/* Table Title */}
        <h2 className="table-title">Tabel Output Data</h2>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Gambar</th>
                <th>Spesifikasi</th>
                <th>Fasilitas</th>
                <th>Lokasi</th>
                <th>Tipe rumah</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataRumah.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="image-cell">
                      {item.gambar && <img src={item.gambar} alt="Rumah" className="table-image" />}
                    </div>
                  </td>
                  <td>{item.spesifikasi}</td>
                  <td>{item.fasilitas}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.tipe}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-detail" onClick={() => handleDetailClick(index)}>
                        Detail
                      </button>
                      <button className="btn btn-hapus" onClick={() => handleHapusClick(index)}>
                        Hapus
                      </button>
                      <button className="btn btn-edit" onClick={() => handleEditClick(index)}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Modal konfirmasi hapus */}
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <h3>Peringatan</h3>
            <p>Yakin ingin menghapus data ini?</p>
            <div className="modal-buttons">
              <button className="btn-ya" onClick={handleConfirmDelete}>Ya</button>
              <button className="btn-tidak" onClick={handleCloseModal}>Tidak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;