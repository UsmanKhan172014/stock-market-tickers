import { addToWatchListHandler } from '@/api/watchlist';
import React, { useEffect, useState } from 'react';
import { auth } from '../../firebaseConfig';
import LoginModal from './authModals/LoginModal';
import SignUpModal from './authModals/SignUpModal';
import ForgetPasswordModal from './authModals/ForgetPasswordModal';
import Swal from 'sweetalert2';
import { Spinner } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const AddToWatchListBtn = ({ data, isTickerExists, watchListLoading, setWatchListLoading, setIsTickerExists }) => {
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [signUpModalVisible, setSignUpModalVisible] = useState(false);
    const [forgetPasswordModalVisible, setForgetPasswordModalVisible] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const addToWatchList = async (uid) => {
        try {
            setWatchListLoading(true);

            const tickerDetails = {
                userID: uid,
                market: data?.results?.market ?? null,
                ticker: data?.results?.ticker ?? null,
                companyName: data?.results?.name ?? null
            };

            const response = await addToWatchListHandler(tickerDetails);

            if (response?.id) {
                setIsTickerExists(true);
                toast.success("Ticker Added to the WatchList!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Fail to add in the watchList",
                    text: "Try Again later"
                });
            }
        } catch (error) {
            // console.log(error, " ======= error");
            Swal.fire({
                icon: "error",
                title: "Fail to add in the watchList",
                text: "Try Again later"
            });
        }
        setWatchListLoading(false);
    }

    const handleAddToWatchList = () => {
        if (user) {
            addToWatchList(user.uid);
        } else {
            setLoginModalVisible(true);
        }
    }

    const handleSwitchModal = (switchToModal) => {
        if (switchToModal == "signUpModal") {
            setSignUpModalVisible(true);
            setLoginModalVisible(false);
        }
        else if (switchToModal == "signInModal") {
            setLoginModalVisible(true);
            setSignUpModalVisible(false);
            if (setForgetPasswordModalVisible) {
                setForgetPasswordModalVisible(false);
            }
        }
        else if (switchToModal == "forgetPasswordModal") {
            setForgetPasswordModalVisible(true);
            setLoginModalVisible(false);
        }
    }

    const toggleModal = (modal) => {
        switch (modal) {
            case 'login':
                setLoginModalVisible(false);
                break;
            case 'signUp':
                setSignUpModalVisible(false);
                break;
            case 'forgetPassword':
                setForgetPasswordModalVisible(false);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <ToastContainer />
            {isTickerExists ?
                <button className='btn add-to-watchList-btn'
                    disabled={isTickerExists}>
                    Added to WatchList
                </button>
                :
                <button className='btn add-to-watchList-btn'
                    onClick={handleAddToWatchList}
                    disabled={watchListLoading}>
                    {watchListLoading ? (
                        <Spinner className='spinner-color-white' animation="border" role="status" style={{ width: '1.5rem', height: '1.5rem' }} />
                    ) : (
                        "Add to WatchList"
                    )}
                </button>
            }
            <LoginModal
                loginModalVisible={loginModalVisible}
                toggleModal={toggleModal}
                handleSwitchModal={handleSwitchModal}
            />
            <SignUpModal
                signUpModalVisible={signUpModalVisible}
                toggleModal={toggleModal}
                handleSwitchModal={handleSwitchModal}
            />
            <ForgetPasswordModal
                forgetPasswordModalVisible={forgetPasswordModalVisible}
                toggleModal={toggleModal}
                handleSwitchModal={handleSwitchModal}
            />
        </>
    )
}

export default AddToWatchListBtn