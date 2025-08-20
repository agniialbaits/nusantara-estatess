import React from 'react'
import { useLocation } from 'react-router-dom'
import './RumahPage.css'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'
import RumahCard from './rumahCard';

const RumahPage = () => {
    const location = useLocation();
    const { searchResults, tipe, lokasi } = location.state || {};

    return (
        <div className='page'>
            <Navbar />
            <div className='title'>
                <div className='isi-title'>
                <h1>
                    Tipe Rumah Modern
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
            <RumahCard searchResults={searchResults} />
            <nav aria-label="Page navigation example">
                <ul className="custom-pagination">
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#" aria-label="Previous">
                            &lt;
                        </a>
                    </li>
                    <li className="page-item active">
                        <a className="page-link rounded-circle" href="#">1</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">2</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">3</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">4</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#">5</a>
                    </li>
                    <li className="page-item">
                        <a className="page-link rounded-circle" href="#" aria-label="Next">
                            &gt;
                        </a>
                    </li>
                </ul>
            </nav>
            <Footer />
        </div>
    );  
};
export default RumahPage