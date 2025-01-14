'use client'
import React, { useState } from 'react';
import { auth, githubProvider } from '../../../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import {Spinner} from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const GithubAuthProviderComp = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const signInWithGithub = () => {
        setLoading(true);
        signInWithPopup(auth, githubProvider)
            .then((result) => {

                const credential = githubProvider.credentialFromResult(result);
                
                const user = auth.currentUser;
                if (user) {
                    linkWithCredential(user, credential)
                        .then(() => {
                            setLoading(false);

                            router.push('/');
                        })
                        .catch((error) => {
                            setLoading(false);
                            // console.error("Error linking GitHub account:", error);
                        });
                }
            }).catch((error) => {
                setLoading(false);
                // console.log("Sign in with github Error: ", error);
            });
    }

    return (
        <button className="w-100 border-0 py-3 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg d-flex align-items-center justify-content-center" style={{ background: "#0061FF1C" }} type="button" onClick={signInWithGithub} disabled={loading}>
            {
                loading ?
                    (
                        <Spinner animation="border" role="status" style={{ width: '1.9rem', height: '1.9rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )
                    : (
                        <Image src="/assets/svg/Github.svg" alt="13" width={50} height={31} priority />
                    )
            }
        </button>
    )
}

export default GithubAuthProviderComp