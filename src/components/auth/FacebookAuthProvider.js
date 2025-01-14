'use client'
import React, { useState } from 'react';
import { auth, facebookProvider } from '../../../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import {Spinner} from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const FacebookAuthProvider = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signInWithFacebook = () => {
        setLoading(true);
        signInWithPopup(auth, facebookProvider)
            .then((result) => {
                const user = result.user;
                if (user?.uid) {
                    router.push('/');
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                // console.log("Sign in with google Error: ", error);
            });
    }

    return (
        <button className="w-100 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg d-flex align-items-center justify-content-center" style={{ background: "#0061FF1C" }} type="button" onClick={signInWithFacebook} disabled={loading}>
            {
                loading ?
                    (
                        <Spinner animation="border" role="status" style={{ width: '1.9rem', height: '1.9rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )
                    : (
                        <Image src="/assets/svg/Facebook.svg" alt="13" width={50} height={31} priority />
                    )
            }
        </button>
    )
}

export default FacebookAuthProvider