import { useRecoilState } from 'recoil';
import { loginState } from '../atom';

function LoginComponent() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(loginState);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <button onClick={handleLogin}>로그인</button>
      )}
    </div>
  );
}