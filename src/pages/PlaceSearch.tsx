import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Region } from '../api/types';
import { getRegions } from '../api/load';

const PlaceSearch: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionData = await getRegions();
        setRegions(regionData);
      } catch (err) {
        console.error('Failed to fetch regions:', err);
        setError('지역 정보를 불러오는 데 실패했습니다.');
      }
    };

    fetchRegions();
  }, []);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(prevRegion => prevRegion === region ? '' : region);
  };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "gu_name": selectedRegion,
                    "clean_text": description
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            navigate('/map', { state: { searchResults: data } });
        } catch (err) {
            console.error('Failed to get recommendations:', err);
            setError('추천 장소를 가져오는 데 실패했습니다.');
        }
    };

  const renderRegionButtons = () => {
    return regions.map((region, index) => (
      <React.Fragment key={region.name}>
        <button
          className={`btn btn-outline-primary m-2 ${selectedRegion === region.name ? 'btn-primary' : ''}`}
          onClick={() => handleRegionChange(region.name)}
        >
          {region.name}
        </button>
        {(index + 1) % 9 === 0 && <div className="w-100"></div>}
      </React.Fragment>
    ));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-75 mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <div className='mt-5 text-center'>
              <img src={process.env.PUBLIC_URL + "/assets/welcome.png"} className="img-fluid" alt="welcome" style={{ maxWidth: '300px', height: 'auto' }} />
              <h2 className="text-center mt-3 fw-bold">
                키즈존 찾기에<br />
                오신 것을 환영합니다.
              </h2>
              <p className="text-center mt-4">
                방문할 지역과 원하는 테마를 알려주시면<br />
                AI가 알맞은 키즈존을 추천해드립니다.
              </p>
              <button className="btn btn-primary d-block mx-auto mt-5 rounded-5" onClick={() => setStep(2)}>START</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="card w-75 mt-4" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="d-flex justify-content-between">
                <img src={process.env.PUBLIC_URL + "/assets/kids_zone.png"} className="img-fluid m-4" alt="welcome" style={{ maxWidth: '100px', height: '20px' }} />
                <p className="m-4"><b>01 <span className="line"></span></b> <span className="text-black-50">02</span></p>
              </div>
              <p className="text-left mt-3 m-4 mb-1 text-black-50">
                오늘은 어디로 가볼까요?
              </p>
              <h2 className="text-left mt-1 m-4">
                <b>오늘 방문할 예정인 지역</b>을 <br />
                선택해 주세요.
              </h2>
              <div className="d-flex justify-content-center flex-wrap">
                {renderRegionButtons()}
              </div>
            </div>
            <div className="text-right d-flex m-4 justify-content-between">
              <button className="btn btn-secondary me-2" onClick={() => setStep(1)}>이전</button>
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(3)}
                disabled={!selectedRegion}
              >
                다음
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="card w-75 mt-4" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="d-flex justify-content-between">
                <img src={process.env.PUBLIC_URL + "/assets/kids_zone.png"} className="img-fluid m-4" alt="welcome" style={{ maxWidth: '100px', height: '20px' }} />
                <p className="m-4"><span className="text-black-50">01</span> <b>02 <span className="line"></span></b></p>
              </div>
              <p className="text-left mt-3 m-4 mb-1 text-black-50">
                어떤 곳을 가고 싶은가요?
              </p>
              <h2 className="text-left mt-1 m-4">
                <b>오늘 방문하고 싶은 장소</b>를<br />
                설명해 주세요.
              </h2>
              <p className='m-4 text-black-50'>
                ex. 맛있는 중국집을 알려줘<br />
                ex. 아이가 체험을 하거나, 재밌게 놀 수 있는 곳을 알려줘<br/>
                ex. 아이가 좋아할 만한 미술관이나 기념관을 알려줘<br/>
              </p>
              <textarea 
                className="form-control m-4" 
                rows={11} 
                value={description} 
                style={{ width: 'calc(100% - 3rem)', resize: 'none'}} 
                onChange={handleDescriptionChange}
              />
            </div>                        
            <div className="text-right d-flex m-4 justify-content-between">
              <button className="btn btn-secondary me-2" onClick={() => setStep(2)}>이전</button>
              <button className="btn btn-primary" onClick={handleSubmit}>찾기</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='App'>
      <Header />
      <Container className="container d-flex justify-content-center align-items-center">
        {renderStep()}
      </Container>
      {error && <div className="alert alert-danger">{error}</div>}
      <Footer />
    </div>
  );
};

export default PlaceSearch;