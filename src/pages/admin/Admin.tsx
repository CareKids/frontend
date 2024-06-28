import React from 'react';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'

function Admin() {
    return (
        <div className="App">
            <Header></Header>
            <div className="container mt-4">
                <h1 className="mb-4"><b>케어키즈 관리자 페이지</b></h1>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Admin;
