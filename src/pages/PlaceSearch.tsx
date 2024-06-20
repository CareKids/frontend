import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header'
import Footer from '../components/Footer'

function PlaceSearch() {
    const [step, setStep] = useState<number>(1); // 현재 단계
    const [region, setRegion] = useState<string>(''); // 지역 선택
    const [description, setDescription] = useState<string>(''); // 설명 입력

    const navigate = useNavigate();

    // 단계 선택 함수
    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    // 지역 선택 함수
    const handleRegionChange = (selectedRegion: string) => {
        setRegion(selectedRegion === region ? '' : selectedRegion);
    };

    // 프롬프트 입력 함수
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/map');
        console.log('제출됨:', region, description);
    };

    return (
        <div className='App'>
            <Header></Header>
            <div className="container d-flex justify-content-center align-items-center">
                {step === 1 && (
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
                            <button className="btn btn-primary d-block mx-auto mt-5 rounded-5" onClick={nextStep}>START</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="card w-75 mt-4" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div className="d-flex justify-content-between">
                                <img src={process.env.PUBLIC_URL + "/assets/kids_zone.png"} className="img-fluid m-4" alt="welcome" style={{ maxWidth: '100px', height: '20px' }} />
                                <p className="m-4"><b>01 <span className="line"></span></b> <span className="text-black-50">02</span></p>
                            </div>
                            <h4 className="text-left mt-3 m-4 mb-1 text-black-50">
                                오늘은 어디로 가볼까요?
                            </h4>
                            <h2 className="text-left mt-1 m-4">
                                <b>오늘 방문할 예정인 지역</b>을 <br />
                                선택해 주세요.
                            </h2>
                            <div className="d-flex justify-content-center">
                                <div className="btn-group" role="group">
                                    <button
                                        className={`btn btn-outline-primary m-2 ${region === '강남구' ? 'btn-primary' : ''}`}
                                        onClick={() => handleRegionChange('강남구')}
                                    >
                                        강남구
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-right d-flex m-4 justify-content-between">
                            <button className="btn btn-secondary me-2" onClick={prevStep}>이전</button>
                            <button className="btn btn-primary" onClick={nextStep}>다음</button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="card w-75 mt-4" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div className="d-flex justify-content-between">
                                <img src={process.env.PUBLIC_URL + "/assets/kids_zone.png"} className="img-fluid m-4" alt="welcome" style={{ maxWidth: '100px', height: '20px' }} />
                                <p className="m-4"><span className="text-black-50">01</span> <b>02 <span className="line"></span></b></p>
                            </div>
                            <h4 className="text-left mt-3 m-4 mb-1 text-black-50">
                                어떤 곳을 가고 싶은가요?
                            </h4>
                            <h2 className="text-left mt-1 m-4">
                                <b>오늘 방문하고 싶은 장소</b>의<br />
                                느낌을 설명해 주세요.
                            </h2>
                            <p className='m-4 text-black-50'>
                                ex. 자연 속에서 아이와 함께 걷고 싶어<br />
                                ex. 실내에서 다양한 활동을 할 수 있는 장소를 가고 싶어.
                            </p>
                            <textarea className="form-control m-4" rows={11} value={description} style={{ width: 'calc(100% - 3rem)', resize: 
                            'none'}} onChange={handleDescriptionChange}></textarea>
                        </div>                        
                        <div className="text-right d-flex m-4 justify-content-between">
                            <button className="btn btn-secondary me-2" onClick={prevStep}>이전</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>찾기</button>
                        </div>
                    </div>
                )}
            </div>
            <Footer></Footer>
        </div>
    );
}

export default PlaceSearch;