import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../Components/navbar/navbar';
import Footer from '../../Components/footer/footer';
import Result from '../../Components/result/Result';
import '../../Components/rumah/RumahPage.css';

const ResultPage = () => {
    const location = useLocation();
    const { tipe, lokasi } = location.state || {};

    return (
        <div>
            <Navbar />
            <div className='title'>
                <div className='isi-title'>
                <h1>
                    Hasil Pencarian
                </h1>
                <p>
                    {lokasi 
                        ? `Menampilkan hasil pencarian ${tipe} di ${lokasi}` 
                        : 'Berikut ini beberapa rumah dengan tipe model modern di berbagai lokasi'
                    }
                </p>
                </div>
            </div>
            <div className="carirumah">
                <div className="search">
                    <div className="search-box-carirumah">
                        <input
                            type="text"
                            placeholder="Cari Lokasi"
                            className="search-input"
                            defaultValue={lokasi || ''}
                        />
                        <button className="Sbutton">Cari</button>
                    </div>
                </div>
            </div>
            <Result tipe={tipe} lokasi={lokasi} />
            <Footer />
        </div>
    );
};

export default ResultPage;