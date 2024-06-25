import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/search');
    };

    return (
        <div className="App">
            <Header></Header>
            <div className="container">
                <div className="row">
                    <div className="col-md-7 d-flex align-items-center">
                        <div className="d-flex flex-column justify-content-center align-items-start text-center text-md-start mt-4">
                            <h1><b>우리 아이와 어딜 가야 할까?</b></h1>
                            <p>
                                <br/>
                                아이들과 다양한 공간을 방문하고<br/>
                                여러 체험을 해보고 싶은 분들을 위해 모든 정보를 모았어요.
                            </p>
                            <p>
                                어떤 곳을 방문하고 싶은가요?<br/>
                                케어kids가 외출 장소 고민을 도와드릴게요!<br/><br/>
                            </p>
                            <button className="btn btn-primary" onClick={handleClick}>키즈존 찾기</button>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <img src={process.env.PUBLIC_URL + "/assets/main.png"} className="img-fluid" alt="mainImg" />
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <strong>놀이 정보</strong>
                        <span className="small ms-2">24개월 미만</span>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                        <a href="/play" className="small text-reset text-decoration-none">더보기</a>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <Link to={`/place/1`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 1</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <Link to={`/place/2`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 2</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <Link to={`/place/3`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 3</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 4</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <strong>정책 정보</strong>
                        <span className="small ms-2">서울시 동작구</span>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                        <a href="/policy" className="small text-reset text-decoration-none">더보기</a>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <Link to={`/policy/1`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 1</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 2</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 3</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                            <div className="card-body">
                                <h4 className="card-title">카드 제목 4</h4>
                                <p className="card-text mb-4">
                                카드 내용이 여기에 들어갑니다. 다섯 줄까지 표시할 수 있습니다.
                                </p>
                                <p className="card-text small text-muted">2024-06-19</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Footer></Footer>
        </div>
    );
}

export default Home;
