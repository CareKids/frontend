import React from 'react';

const NaverButton: React.FC = () => {
    const NaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    return (
        <a href="#" onClick={NaverLogin}>
            <img 
                src={process.env.PUBLIC_URL + "/assets/btn_naver.png"} 
                alt="네이버 로그인" 
                style={{ width: '45px', height: '45px' }}
                className=''
            />
        </a>
    );
};

export default NaverButton;