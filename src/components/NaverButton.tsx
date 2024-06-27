import React, { useEffect } from 'react';

const NaverButton: React.FC = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_NAVER_CALLBACK_URL;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

    const NaverLogin = () => {
        window.location.href = NAVER_AUTH_URL;
    };

    return (
        <a href="#" onClick={NaverLogin}>
            <img 
                src={process.env.PUBLIC_URL + "/assets/btn_naver.png"} 
                alt="네이버 로그인" 
                style={{ width: '45px', height: '45px' }}
            />
        </a>
        // <div onClick={NaverLogin}>네이버 로그인</div>
    );
};

export default NaverButton;