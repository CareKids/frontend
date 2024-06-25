import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRecoilValue } from 'recoil';
import { loginState } from '../atom';

type MenuItem = {
    title: string;
    subMenuItems?: { title: string; link: string }[];
};

function Menu() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const isLoggedIn = useRecoilValue(loginState);

    const handleMouseEnter = (menu: string) => {
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
    };

    const menuItems: MenuItem[] = [
        {
            title: '키즈존 찾기',
            subMenuItems: [
                { title: '키즈존 찾기', link: '/search' },
            ],
        },
        {
            title: '자료실',
            subMenuItems: [
                { title: '장소', link: '/place' },
                { title: '주말 어린이집', link: '/class' },
                { title: '긴급 진료기관', link: '/hospital' },
            ],
        },
        {
            title: '육아 정보',
            subMenuItems: [
                { title: '놀이 정보', link: '/play' },
                { title: '정책', link: '/policy' },
            ],
        },
        {
            title: '게시판',
            subMenuItems: [
                { title: '공지사항', link: '/board' },
                { title: '문의하기', link: '/qna' },
            ],
        },
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-light border-bottom">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Logo" />
                </a>

                <ul className="navbar-nav">
                    {menuItems.map((menuItem, index) => (
                        <li key={index} className={`nav-item dropdown ${activeMenu === menuItem.title ? 'show' : ''}`}
                            onMouseEnter={() => handleMouseEnter(menuItem.title)}
                            onMouseLeave={handleMouseLeave}>
                            <a className={`nav-link dropdown-toggle ${menuItem.subMenuItems ? 'cursor-pointer' : ''}`}
                                onClick={handleClick}
                                id={`navbarDropdown${index}`} role="button" aria-haspopup="true" aria-expanded="false">
                                {menuItem.title}
                            </a>
                            {menuItem.subMenuItems && (
                                <div className={`dropdown-menu ${activeMenu === menuItem.title ? 'show' : ''}`} aria-labelledby={`navbarDropdown${index}`}>
                                    {menuItem.subMenuItems.map((subMenuItem, subIndex) => (
                                        <a key={subIndex} className="dropdown-item" href={subMenuItem.link}>{subMenuItem.title}</a>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="ml-auto">
                    <a 
                        href={isLoggedIn ? "/mypage" : "/login"} 
                        className="text-reset text-decoration-none"
                    >
                        {isLoggedIn ? '마이페이지' : '로그인'}
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Menu;