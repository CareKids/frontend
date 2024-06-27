import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { loginState } from '../atom';

type MenuItem = {
    title: string;
    subMenuItems?: { title: string; link: string }[];
};

function Header() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const isLoggedIn = useRecoilValue(loginState);

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed);
    }
    
    const handleMouseEnter = (menu: string) => {
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
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
        <>
        <nav className="navbar navbar-expand-lg navbar-light border-bottom">
            <div className="container">
                {/* 로고 */}
                <a className="navbar-brand" href="/">
                    <img className="logo" src={process.env.PUBLIC_URL + "/assets/logo.png"} alt="Logo" />
                </a>

                {/* 모바일 메뉴 버튼 */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded={!isNavCollapsed ? true : false} 
                    aria-label="Toggle navigation"
                    onClick={handleNavCollapse}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 데스크탑 메뉴 */}
                <ul className="navbar-nav mr-auto d-none d-lg-flex">
                    {menuItems.map((menuItem, index) => (
                        <li 
                            key={index} 
                            className={`nav-item dropdown ${activeMenu === menuItem.title ? 'show' : ''}`}
                            onMouseEnter={() => handleMouseEnter(menuItem.title)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <a 
                                className={`nav-link dropdown-toggle ${menuItem.subMenuItems ? '' : 'active'}`}
                                id={`navbarDropdown${index}`}
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded={activeMenu === menuItem.title ? 'true' : 'false'}
                            >
                                {menuItem.title}
                            </a>
                            {menuItem.subMenuItems && (
                                <div 
                                    className={`dropdown-menu ${activeMenu === menuItem.title ? 'show' : ''}`} 
                                    aria-labelledby={`navbarDropdown${index}`}
                                >
                                    {menuItem.subMenuItems.map((subMenuItem, subIndex) => (
                                        <a key={subIndex} className="dropdown-item" href={subMenuItem.link}>
                                            {subMenuItem.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="ml-auto d-none d-lg-block">
                    <a 
                        href={isLoggedIn ? "/mypage" : "/login"} 
                        className="btn my-2 my-sm-0"
                    >
                        {isLoggedIn ? '마이페이지' : '로그인'}
                    </a>
                </div>
            </div>
        </nav>

        {/* 모바일 메뉴 */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse bg-white d-lg-none`} id="navbarSupportedContent">
            <div className="container">
                <ul className="navbar-nav mr-auto p-3" style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map((menuItem, index) => (
                        <li key={index} className="nav-item mb-2">
                            <span style={{ fontWeight: 'bold' }}>{menuItem.title}</span>
                            {menuItem.subMenuItems && (
                                <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
                                    {menuItem.subMenuItems.map((subMenuItem, subIndex) => (
                                        <li key={subIndex}>
                                            <a className="nav-link" href={subMenuItem.link}>
                                                {subMenuItem.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                    <li className="nav-item">
                        <a
                            href={isLoggedIn ? "/mypage" : "/login"} 
                            className="my-2 my-sm-0 text-reset text-decoration-none"
                        >
                            <span style={{ fontWeight: 'bold' }}>{isLoggedIn ? '내 정보' : '로그인'}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        </>
    );
}

export default Header;