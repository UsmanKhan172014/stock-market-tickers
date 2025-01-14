'use client'
import React, { useState } from 'react';
import { auth, twitterProvider } from '../../../firebaseConfig';
import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import {Spinner} from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const TwitterAuthProviderComp = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signInWithTwitter = () => {
        setLoading(true);
        signInWithPopup(auth, twitterProvider)
            .then((result) => {

                setLoading(false);
                const credential = TwitterAuthProvider.credentialFromResult(result);

                if (credential.accessToken) {
                    router.push('/');
                }
            }).catch((error) => {
                setLoading(false);
                console.error(error);
            });
    }

    return (
        <button className="w-100 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg d-flex align-items-center justify-content-center" style={{ background: "#0061FF1C" }} type="button" onClick={signInWithTwitter} disabled={loading}>
            {
                loading ?
                    (
                        <Spinner animation="border" role="status" style={{ width: '1.9rem', height: '1.9rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )
                    : (
                        <Image src="/assets/svg/TwitterX.svg" alt="Twitter" width={40} height={31} priority />
                    )
            }
        </button>
    )
}

export default TwitterAuthProviderComp