import React, { useState } from 'react';
import { auth, googleProvider } from '../../../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import {Spinner} from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const GoogleAuthProvider = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signInWithGoogle = () => {
        setLoading(true);
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {

                const user = result.user;
                const uid = user.uid;

                if (uid) {
                    router.push('/');
                }

                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                // console.log("Sign in with google Error: ", error);
            });
    }

    return (
        <button className="w-100 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg d-flex align-items-center justify-content-center" style={{ background: "#0061FF1C" }} type="button" onClick={signInWithGoogle} disabled={loading}>
            {
                loading ?
                    (
                        <Spinner animation="border" role="status" style={{ width: '1.9rem', height: '1.9rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )
                    : (
                        <Image src="/assets/svg/Google.svg" alt="13" width={40} height={31} priority />
                    )
            }
        </button>
    )
}

export default GoogleAuthProvider