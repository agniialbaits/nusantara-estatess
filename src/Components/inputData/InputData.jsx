import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './inputData.css';
import '../navbar/adminNavbar.css';
import AdminNavbar from '../navbar/AdminNavbar';

const InputData = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIndex = searchParams.get('edit');

  const [formData, setFormData] = useState({
    gambar: null,
    gambarDetail: null,
    spesifikasi: '',
    fasilitas: '',
    lokasi: '',
    tipe: '',
    harga: ''
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (editIndex != null) {
      const semua = JSON.parse(localStorage.getItem('dataRumah')) || [];
      const curr = semua[parseInt(editIndex)];
      if (curr) {
        setFormData({
          gambar: null,
          gambarDetail: null,
          spesifikasi: curr.spesifikasi || '',
          fasilitas: curr.fasilitas || '',
          lokasi: curr.lokasi || '',
          tipe: curr.tipe || '',
          harga: curr.harga || ''
        });
      }
    }
  }, [editIndex]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSimpan = (e) => {
    e.preventDefault();
    const semua = JSON.parse(localStorage.getItem('dataRumah')) || [];

    const objBaru = {
      gambar: formData.gambar
        ? URL.createObjectURL(formData.gambar)
        : (editIndex != null && semua[editIndex]?.gambar) || '',
      gambarDetail: formData.gambarDetail
        ? URL.createObjectURL(formData.gambarDetail)
        : (editIndex != null && semua[editIndex]?.gambarDetail) || '',
      spesifikasi: formData.spesifikasi,
      fasilitas: formData.fasilitas,
      lokasi: formData.lokasi,
      tipe: formData.tipe,
      harga: formData.harga
    };

    let updated;
    if (editIndex != null) {
      updated = [...semua];
      updated[parseInt(editIndex)] = objBaru;
    } else {
      updated = [...semua, objBaru];
    }

    localStorage.setItem('dataRumah', JSON.stringify(updated));
    setShowModal(true);
  };

  return (
    <div className="input-data-page">
      <AdminNavbar />

      {/* Main Content */}
      <div className="main-content">
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Input data rumah</h1>
          </div>

          <div className="form-content">
            <div className="form-section-header">
              <h2>Tambahkan data</h2>
              <p>Tambahkan data untuk menampilkan informasi rumah</p>
            </div>

            <form onSubmit={handleSimpan} className="input-form">
              {/* Masukkan gambar card */}
              <div className="form-group">
                <label>Masukkan gambar card</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    name="gambar"
                    onChange={handleChange}
                    className="file-input"
                    id="gambar"
                  />
                  <label htmlFor="gambar" className="file-input-label">
                    📁 Pilih file
                  </label>
                </div>
              </div>

              {/* Masukkan gambar detail */}
              <div className="form-group">
                <label>Masukkan gambar detail</label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    name="gambarDetail"
                    onChange={handleChange}
                    className="file-input"
                    id="gambarDetail"
                  />
                  <label htmlFor="gambarDetail" className="file-input-label">
                    📁 Pilih file
                  </label>
                </div>
              </div>

              {/* Spesifikasi */}
              <div className="form-group">
                <label>Spesifikasi</label>
                <input
                  type="text"
                  name="spesifikasi"
                  value={formData.spesifikasi}
                  onChange={handleChange}
                  className="text-input"
                  placeholder="masukkan spesifikasi"
                />
              </div>

              {/* Fasilitas */}
              <div className="form-group">
                <label>Fasilitas</label>
                <input
                  type="text"
                  name="fasilitas"
                  value={formData.fasilitas}
                  onChange={handleChange}
                  className="text-input"
                  placeholder="masukkan fasilitas"
                />
              </div>

              {/* Lokasi */}
              <div className="form-group">
                <label>Lokasi</label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className="text-input"
                  placeholder="masukkan lokasi"
                />
              </div>

              {/* Tipe rumah */}
              <div className="form-group">
                <label>Tipe rumah</label>
                <select
                  name="tipe"
                  value={formData.tipe}
                  onChange={handleChange}
                  className="select-input"
                >
                  <option value="">masukkan tipe rumah</option>
                  <option value="Minimalis">Minimalis</option>
                  <option value="Modern">Modern</option>
                  <option value="Klasik">Klasik</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              {/* Harga */}
              <div className="form-group">
                <label>Harga</label>
                <input
                  type="text"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  className="text-input"
                  placeholder="masukkan harga"
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button type="submit" className="btn-simpan">Simpan</button>
                <button type="button" className="btn-lihat-data" onClick={() => navigate('/admin')}>Lihat data</button>
                <button type="button" className="btn-reset" onClick={() => {
                  setFormData({
                    gambar: null,
                    gambarDetail: null,
                    spesifikasi: '',
                    fasilitas: '',
                    lokasi: '',
                    tipe: '',
                    harga: ''
                  });
                }}>Reset</button>
              </div>
            </form>
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

      {/* Modal */}
      {showModal && (
        <div className="overlay">
          <div className="modal">
            <p>Data berhasil {editIndex != null ? 'diupdate' : 'disimpan'}</p>
            <div className="modal-buttons">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="btn-ok"
              >
                Ok
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-batal-modal"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputData;
