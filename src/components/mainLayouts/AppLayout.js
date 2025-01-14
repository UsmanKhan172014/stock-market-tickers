'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../layout/NavbarMain';
import Footer from '../layout/Footer';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../../../firebaseConfig';
import Sidebar from '../layout/Sidebar';
import TradingSightsStatic from '../TradingSightsStatic';
import { signOut } from 'firebase/auth';
import LoginModal from '../authModals/LoginModal';
import SignUpModal from '../authModals/SignUpModal';
import ForgetPasswordModal from '../authModals/ForgetPasswordModal';
import AdsDisplay from '../AdsDisplay';

export default function AppLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState({});
    const [isOpen, setIsOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);
    const [forgetPasswordModalVisible, setForgetPasswordModalVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const isSidebarOpen = localStorage.getItem('isSidebarOpen');
        setIsOpen(isSidebarOpen === 'true');
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const windowSize = window.innerWidth;
            if (window.innerWidth >= 840) {
                setWindowWidth(windowSize);
                setIsOpen(true);
                setIsSmallScreen(false);
            } else {
                setWindowWidth(windowSize);
                setIsOpen(false);
                setIsSmallScreen(true);
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const clearLocalStorage = () => {
            localStorage.removeItem('newsData');
            localStorage.removeItem('newsNextUrl');
            localStorage.setItem('isSidebarOpen', true);
            localStorage.removeItem('isGoToWatchList');
        };
        window.addEventListener('beforeunload', clearLocalStorage);

        return () => {
            window.removeEventListener('beforeunload', clearLocalStorage);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                if (loginModalVisible) {
                    setLoginModalVisible(false);
                }
                if (signUpModalVisible) {
                    setSignUpModalVisible(false);
                }
            }
            if (window.innerWidth <= 500) {
                localStorage.setItem('isSidebarOpen', false);
                setIsOpen(false);
            } else {
                const isSidebarOpen = localStorage.getItem('isSidebarOpen');
                setIsOpen(isSidebarOpen === 'true');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        if (user && user.uid) {
            try {
                await signOut(auth);
                setUser({});
                localStorage.removeItem('User');
            } catch (error) {
                console.error('Error logging out:', error.message);
            }
        }
    }

    const handleSwitchModal = (switchToModal) => {
        if (switchToModal === "signUpModal") {
            setSignUpModalVisible(true);
            setLoginModalVisible(false);
        }
        else if (switchToModal === "signInModal") {
            setLoginModalVisible(true);
            setSignUpModalVisible(false);
            if (setForgetPasswordModalVisible) {
                setForgetPasswordModalVisible(false);
            }
        }
        else if (switchToModal === "forgetPasswordModal") {
            setForgetPasswordModalVisible(true);
            setLoginModalVisible(false);
        }
    }

    const handleToggleSidebar = () => {
        const newIsOpen = !isOpen;
        localStorage.setItem('isSidebarOpen', newIsOpen);
        setIsOpen(newIsOpen);
    }

    const toggleModal = (modal) => {
        if (window.innerWidth < 450) {
            setIsOpen(false);
        }
        switch (modal) {
            case 'login':
                setLoginModalVisible(!loginModalVisible);
                break;
            case 'signUp':
                setSignUpModalVisible(!signUpModalVisible);
                break;
            case 'forgetPassword':
                setForgetPasswordModalVisible(!forgetPasswordModalVisible);
                break;
            default:
                break;
        }
    }

    const watchListRoute = () => {
        if (Object.keys(user).length > 0) {
            router.push("/watchlist");
        } else {
            setLoginModalVisible(true);
        }
    }

    return (
        <>
            <div className="top-static-bars">
                <TradingSightsStatic barHeading={"Stocks"} />
                <TradingSightsStatic barHeading={"Crypto"} />
            </div>
            <Navbar
                user={user}
                setUser={setUser}
                handleLogout={handleLogout}
                handleToggleSidebar={handleToggleSidebar}
                sidebarIsOpen={isOpen}
                toggleModal={toggleModal}
                isSmallScreen={isSmallScreen}
            />
            <main>
                <div className="d-flex">
                    <Sidebar
                        isOpen={isOpen}
                        handleToggleSidebar={handleToggleSidebar}
                        handleLogout={handleLogout}
                        user={user}
                        watchListRoute={watchListRoute}
                    />
                    <div className="container-fluid" style={{ background: "whitesmoke" }}>
                        {children}
                    </div>
                    {pathname === "/" ? (
                        <AdsDisplay />
                    ) : ""}
                </div>
            </main>
            <Footer />
            <LoginModal
                loginModalVisible={loginModalVisible}
                toggleModal={toggleModal}
                handleSwitchModal={handleSwitchModal}
                isSmallScreen={isSmallScreen}
            />
            <SignUpModal
                signUpModalVisible={signUpModalVisible}
                toggleModal={toggleModal}
                handleSwitchModal={handleSwitchModal}
                isSmallScreen={isSmallScreen}
            />
            <ForgetPasswordModal
                forgetPasswordModalVisible={forgetPasswordModalVisible}
                toggleModal={toggleModal}
                handleSwitchModal={handleSwitchModal}
            />
        </>
    )
}