import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header'
import Footer from '../components/Footer'

import { getHomeInfo } from '../api/load';
import { HomeInfo } from '../api/types';

function Home() {
    const navigate = useNavigate();
    const [homeData, setHomeData] = useState<HomeInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomeInfo = async () => {
            try {
                setIsLoading(true);
                const data = await getHomeInfo();
                setHomeData(data);
            } catch (err) {
                setError('Failed to fetch home info');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchHomeInfo();
    }, []);
  
    const handleClick = () => {
        navigate('/search');
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!homeData) {
        return <div>데이터가 없습니다</div>;
    }

    return (
        <div className="App">
            <Header></Header>
            <div className="container">
                <div className="row">
                    <div className="col-md-7 d-flex align-items-center">
                        <div className="d-flex flex-column justify-content-center align-items-start text-md-start mt-4">
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
                        <span className="small ms-2">
                            {homeData['play-info'] && homeData['play-info']['age-tag'] 
                                ? homeData['play-info']['age-tag'].name 
                                : 'N/A'}
                        </span>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                        <a href="/play" className="small text-reset text-decoration-none">더보기</a>
                    </div>
                </div>

                <div className="row mt-3">
                    {homeData['play-info'] && homeData['play-info']['play-info'] 
                        ? homeData['play-info']['play-info'].slice(0, 4).map((item) => (
                            <div className="col-md-3 mb-4" key={item.id}>
                                <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                                    <Link to={`/play/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card-body">
                                            <h4 className="card-title"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                }}>{item.title}</h4>
                                            <div className="card-text mb-4" 
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 5,
                                                    WebkitBoxOrient: 'vertical',
                                                    minHeight: '100px',
                                                    maxHeight: '100px',
                                                    fontSize: '14px'
                                                }}>
                                                {item.description}
                                            </div>
                                            <p className="card-text small text-muted">
                                                {new Date(item.createdAt[0], item.createdAt[1]-1, item.createdAt[2]).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                        : <div>놀이 정보가 없습니다.</div>
                    }
                </div>
            </div>

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <strong>정책 정보</strong>
                        <span className="small ms-2">
                        {homeData['kids-policy'] && homeData['kids-policy']['region']
                        ? (homeData['kids-policy']['region'])[0]?.name 
                        : 'N/A'}
                        </span>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                        <a href="/policy" className="small text-reset text-decoration-none">더보기</a>
                    </div>
                </div>
                {homeData['kids-policy'] && homeData['kids-policy']['kids-policy'] && homeData['kids-policy']['kids-policy'].length > 0 ? (
                    <div className="row mt-3">
                        {homeData['kids-policy']['kids-policy'].map((item, index) => (
                            <div className="col-md-3 mb-4" key={index}>
                                <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                                    <Link to={`/policy/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card-body">
                                            <h4 className="card-title"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                }}>{item.title}</h4>
                                            <p className="card-text mb-4"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 5,
                                                    WebkitBoxOrient: 'vertical',
                                                    minHeight: '100px',
                                                    maxHeight: '100px',
                                                    fontSize: '14px'
                                                }}>
                                                {item.description}
                                            </p>
                                            <p className="card-text small text-muted">
                                                {new Date(item.createdAt[0], item.createdAt[1]-1, item.createdAt[2]).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>정책 정보가 없습니다.</p>
                )}
            </div>

            <Footer />
        </div>
    );
}
export default Home;
