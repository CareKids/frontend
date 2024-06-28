import React, { useEffect } from 'react';

const NaverButton: React.FC = () => {
    useEffect(() => {
        const originalBabelPolyfill = (window as any)._babelPolyfill;
        (window as any)._babelPolyfill = undefined;

        const script = document.createElement('script');
        script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            (window as any)._babelPolyfill = originalBabelPolyfill;

            const naverLogin = new (window as any).naver.LoginWithNaverId({
                clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
                callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
                isPopup: true,
                loginButton: {color: "green", type: 1, height: 45}
            });
            naverLogin.init();
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="naverIdLogin"></div>
    );
};

export default NaverButton;