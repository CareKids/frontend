import React, { useEffect } from 'react';

const GoogleButton: React.FC = () => {
    const GoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
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