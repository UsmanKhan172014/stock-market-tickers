import { faCaretDown, faCaretUp, faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

const Sidebar = ({ isOpen, handleToggleSidebar, handleLogout, user, watchListRoute }) => {
    const pathname = usePathname();
    const [stocksChildListVisible, setStocksChildListVisible] = useState(false);
    const [cryptoChildListVisible, setCryptoChildListVisible] = useState(false);

    const toggleStocksChildList = () => {
        setStocksChildListVisible(!stocksChildListVisible);
    };
    const toggleCryptoChildList = () => {
        setCryptoChildListVisible(!cryptoChildListVisible);
    };

    return (
        <div className={`${isOpen ? "left-sidebar" : "left-sidebar-closed"}`}>
            <div className="scroll-sidebar">
                <nav className="sidebar-nav">
                    <ul id="sidebar-menu">
                        <li className={`sidebar-toggler-button mb-2 ${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <div className={`d-flex ${isOpen ? "justify-content-end" : "justify-content-center"} px-2`}>
                                <span onClick={handleToggleSidebar} style={{ cursor: "pointer" }}>
                                    {isOpen ?
                                        <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" />
                                        :
                                        <FontAwesomeIcon icon={faCircleArrowRight} size="lg" />
                                    }
                                </span>
                            </div>
                        </li>
                        <li className={`${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <Link href={"/"}
                                className={`d-flex align-items-center ${isOpen ? "navbar-link" : "navbar-link-closed"} ${pathname == "/" ? "active" : ""}`}
                            >
                                <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                <span className="hide-menu">Home</span>
                            </Link>
                        </li>
                        <li className={`${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <div className={`w-100 ${isOpen ? "navbar-link" : "navbar-link-closed"} ${isOpen ? "parent-list-button" : "parent-list-button-close"} ${pathname == "/stocks" ? "active" : ""}`}
                                onClick={toggleStocksChildList}
                            >
                                <div className="toggleDescription d-flex align-items-center">
                                    <Image className='me-2'
                                        src="/assets/sidebar-Icons/Stocks.svg"
                                        alt=""
                                        width={22}
                                        height={22}
                                        priority
                                    />
                                    <span className="hide-menu">Stocks</span>
                                </div>
                                <div className="toggleIcon d-flex align-items-center">
                                    {stocksChildListVisible ?
                                        <FontAwesomeIcon icon={faCaretUp} />
                                        :
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    }
                                </div>
                            </div>
                            <ul className={`${isOpen ? "child-list" : "child-list-closed"} ${stocksChildListVisible ? "" : "d-none"}`}>
                                <li className={`py-2 ${isOpen ? " child-list-item" : "child-list-item-closed"} mt-3`}>
                                    <Link href={"/stocks"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2'
                                            src="/assets/sidebar-Icons/Screener.svg"
                                            alt=""
                                            width={22}
                                            height={22}
                                            priority
                                        />
                                        <span className="hide-menu">Stock  Screener</span>
                                    </Link>
                                </li>
                                {/* <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/stocks"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Earning Calendar</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/stocks"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">By Industry</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/stocks"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Stock List</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/stocks"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Top Analysts</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/stocks"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu"> Top Stocks</span>
                                    </Link>
                                </li> */}
                            </ul>
                        </li>
                        <li className={`${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <div className={`w-100 ${isOpen ? "navbar-link" : "navbar-link-closed"} ${isOpen ? "parent-list-button" : "parent-list-button-close"} ${pathname == "/crypto" ? "active" : ""}`}
                                onClick={toggleCryptoChildList}
                            >
                                <div className="toggleDescription">
                                    <Image className='me-2'
                                        src="/assets/sidebar-Icons/Crypto.svg"
                                        alt=""
                                        width={22}
                                        height={22}
                                        priority
                                    />
                                    <span className="hide-menu">Crypto</span>
                                </div>
                                <div className="toggleIcon">
                                    {cryptoChildListVisible ?
                                        <FontAwesomeIcon icon={faCaretUp} />
                                        :
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    }
                                </div>
                            </div>
                            <ul className={`${isOpen ? "child-list" : "child-list-closed"} ${cryptoChildListVisible ? "" : "d-none"}`}>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed"} mt-3`}>
                                    <Link href={"/crypto"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Ranking.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Ranking</span>
                                    </Link>
                                </li>
                                {/* <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/crypto"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Categories</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/crypto"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Global Charts</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/crypto"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Historical Snapshots</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/crypto"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Bitcoin ETFs</span>
                                    </Link>
                                </li>
                                <li className={`py-2 ${isOpen ? "child-list-item" : "child-list-item-closed d-none"}`}>
                                    <Link href={"/crypto"}
                                        className={`${isOpen ? "navbar-child-link" : "navbar-child-link-closed"}`}
                                    >
                                        <Image className='me-2' src="/assets/sidebar-Icons/Home.svg" alt="" width={22} height={22} priority />
                                        <span className="hide-menu">Trending</span>
                                    </Link>
                                </li> */}
                            </ul>
                        </li>
                        <li className={`${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <Link href={"/news"} className={`${isOpen ? "navbar-link" : "navbar-link-closed"} d-flex align-items-center ${pathname == "/news" ? "active" : ""}`}>
                                <Image className='me-2'
                                    src="/assets/sidebar-Icons/News.svg"
                                    alt=""
                                    width={20}
                                    height={20}
                                    priority
                                />
                                <span className="hide-menu">News</span>
                            </Link>
                        </li>
                        <li className={`${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <a href={"#"}
                                className={`${isOpen ? "navbar-link" : "navbar-link-closed"} d-flex align-items-center ${pathname == "/watchlist" ? "active" : ""}`}
                                onClick={watchListRoute}>
                                <Image className='me-2'
                                    src="/assets/sidebar-Icons/WatchList.svg"
                                    alt=""
                                    width={22}
                                    height={22}
                                    priority
                                />
                                <span className="hide-menu">Watchlist</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            {user && user?.uid ? (
                <nav className="sidebar-nav">
                    <ul id="sidebar-menu">
                        <li className={`${isOpen ? "nav-label" : "nav-label-closed"}`}>
                            <Link onClick={handleLogout} href={"#"}
                                className={`d-flex align-items-center ${isOpen ? "navbar-link" : "navbar-link-closed"}`}
                            >
                                <Image className='me-2' src="/assets/sidebar-Icons/SignOut.svg" alt="" width={22} height={22} priority />
                                <span className="hide-menu">Logout</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            ) : null}
        </div>
    )
}

export default Sidebar