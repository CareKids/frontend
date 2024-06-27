import React, { useEffect } from 'react';

const GoogleButton: React.FC = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_NAVER_CALLBACK_URL;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email`;

    const GoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <a href="#" onClick={GoogleLogin}>
            <img 
                src={process.env.PUBLIC_URL + "/assets/btn_google.png"} 
                alt="구글 로그인" 
                style={{ width: '45px', height: '45px' }}
                className='me-2'
            />
        </a>
    );
};

export default GoogleButton;