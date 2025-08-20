import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dataTabel.css';
import '../navbar/adminNavbar.css';
import AdminNavbar from '../navbar/AdminNavbar';

const TabelOutput = () => {
  const [dataRumah, setDataRumah] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('dataRumah')) || [];
    setDataRumah(data);
  }, []);

  const handleSort = () => {
    const sorted = [...dataRumah].sort((a, b) => {
      const hargaA = parseInt(a.harga.replace(/\D/g, '')) || 0;
      const hargaB = parseInt(b.harga.replace(/\D/g, '')) || 0;
      return sortAsc ? hargaA - hargaB : hargaB - hargaA;
    });
    setDataRumah(sorted);
    setSortAsc(!sortAsc);
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

  const handleEditClick = () => {
    navigate('/input-data');
  };

  return (
    <div className="data-tabel-page">
      <AdminNavbar />
      
      <div className="main-content">
        <div className="content-header">
          <button className="btn-tambah-data" onClick={() => navigate('/input-data')}>
            Tambah data
          </button>
          <h1 className="page-title">Tabel Output Data</h1>
        </div>

        <div className="table-container">
          <div className="table-scroll">
            <table className="output-table">
              <thead>
                <tr>
                  <th>Gambar</th>
                  <th>Spesifikasi</th>
                  <th>Fasilitas</th>
                  <th>Lokasi</th>
                  <th>Tipe rumah</th>
                  <th onClick={handleSort} className="sortable">
                    Harga {sortAsc ? '▲' : '▼'}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {dataRumah.map((item, index) => (
                  <tr key={index}>
                    <td className="image-cell">
                      {item.gambar && (
                        <img 
                          src={item.gambar} 
                          alt="Rumah" 
                          className="table-image"
                        />
                      )}
                    </td>
                    <td>{item.spesifikasi}</td>
                    <td>{item.fasilitas}</td>
                    <td>{item.lokasi}</td>
                    <td>{item.tipe}</td>
                    <td>{item.harga}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-detail"
                          onClick={() => navigate(`/detail/${index}`)}>
                          Detail
                        </button>
                        <button className="btn btn-hapus" onClick={() => handleHapusClick(index)}>
                          Hapus
                        </button>
                        <button className="btn btn-edit" onClick={handleEditClick}>
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
      </div>

      {/* Bottom Footer */}
      <footer className="bottom-footer">
        <div className="footer-container">
          <div className="footer-logo">
            <div className="footer-logo-circle">
              <span>NE</span>
            </div>
            <span className="footer-logo-text">Nusantara Estates</span>
          </div>
          <ul className="footer-menu">
            <li><a href="/">Beranda</a></li>
            <li><a href="/layanan">Layanan</a></li>
            <li><a href="/kontak">Kontak</a></li>
            <li><a href="/admin">Dashboard</a></li>
          </ul>
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

export default TabelOutput;
