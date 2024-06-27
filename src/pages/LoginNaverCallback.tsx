import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NaverLoginCallback: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
      let code = new URL(window.location.href).searchParams.get("code");
      console.log(code);

      // TODO: 백엔드로 인가 코드 전송
  
      // TODO: 처리가 끝나고 navigate(-1)
    });
  
    return (
      <div>
        {/* TODO: 로그인 로딩 창 제작 */}
        네이버 로그인
      </div>
    );
};


export default NaverLoginCallback;