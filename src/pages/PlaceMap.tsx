import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import Header from '../components/Header';
import './PlaceMap.css'

const PlaceMap: React.FC = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_API_ID}`;
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const center = new window.naver.maps.LatLng(37.3595704, 127.105399);
            const map = new window.naver.maps.Map('map', {
                center: center,
                zoom: 16
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/search');
    };

    return (        
        <div className='App'>
            <Header />
            <div className="container-fluid no-padding" style={{margin: '0px'}}>
                <div className="row no-margin">
                    <div className="col-sm-auto bg-white" style={{ minWidth: '400px', padding: '0px', overflowY: 'auto', maxHeight: 'calc(100vh - 80px)' }}>
                        <div className="p-3" style={{ width: '100%' }}>
                            <button className="btn btn-primary w-100" onClick={handleClick}>다시 찾아보기</button>
                        </div>
                        <div>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="p-3 mb-2 border-bottom">
                                    <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                                        <img 
                                            src={`https://via.placeholder.com/150?text=Image+${index + 1}`} 
                                            alt={`Image ${index + 1}`} 
                                            className="img-fluid" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h5 className="mt-3">제목 {index + 1}</h5>
                                    <div className="ml-auto d-flex">
                                        <div className="btn btn-outline-primary rounded-5" style={{ fontSize: '12px', marginRight: '5px' }}>태그1</div>
                                        <div className="btn btn-outline-primary rounded-5" style={{ fontSize: '12px', marginRight: '5px' }}>태그2</div>
                                        <div className="btn btn-outline-primary rounded-5" style={{ fontSize: '12px', marginRight: '5px' }}>태그3</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-center">
                            <Pagination>
                                <PaginationItem>
                                <PaginationLink first href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationLink previous href="#" />
                                </PaginationItem>
                                <PaginationItem active>
                                <PaginationLink href="#">
                                    1
                                </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationLink href="#">
                                    2
                                </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationLink next href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                <PaginationLink last href="#" />
                                </PaginationItem>
                            </Pagination>
                        </div>
                    </div>
                <div className="col" style={{padding: '0px'}}>
                    <div id="map" className="h-screen relative z-0" style={{ height: 'calc(100vh - 80px)' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceMap;
