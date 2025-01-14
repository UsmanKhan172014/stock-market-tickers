'use client'
import React, { useState } from 'react';
import { appleProvider, auth, db, facebookProvider, githubProvider, googleProvider, microsoftProvider, twitterProvider } from '../../../firebaseConfig';
import { GithubAuthProvider, OAuthProvider, TwitterAuthProvider, fetchSignInMethodsForEmail, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {Spinner} from 'react-bootstrap';

const SocialProviders = () => {
    const [loading, setLoading] = useState('');

    const signInWithGoogle = () => {
        setLoading(true);
        signInWithPopup(auth, googleProvider)
            .then(async (result) => {

                const user = result.user;
                const uid = user.uid;

                const userData = await getUserData(uid);

                if (userData?.role === "admin") {
                    router.push('/dashboard');
                }
                else if (userData?.role === "user") {
                    router.push('/dashboard');
                }

                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                // console.log("Sign in with google Error: ", error);
            });
    }

    const signInWithMicrosoft = () => {
        microsoftProvider.setCustomParameters({
            prompt: 'select_account', // Prompt user to select account during sign-in
            userAudience: 'All', // Allow access to '/common/' endpoint
            tenant: '3045ead4-6ed1-4815-961a-6a1014bf98cf' // Azure AD tenant ID
        });

        signInWithPopup(auth, microsoftProvider)
            .then((result) => {

                // Access token and ID token (if needed)
                // const credential = OAuthProvider.credentialFromResult(result);
                // const accessToken = credential.accessToken;
                // const idToken = credential.idToken;

            })
            .catch((error) => {
                // Handle sign-in error
                setLoading(false);
                // console.error('Sign in with Microsoft Error:', error);
            });
    }

    const signInWithApple = () => {
        signInWithPopup(auth, appleProvider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;

                // Apple credential
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
            })
            .catch((error) => {
                setLoading(false);
                // console.log("Sign in with Apple Error: ", error);
            });
    }

    const signInWithTwitter = () => {
        signInWithPopup(auth, twitterProvider)
            .then((result) => {
                const credential = TwitterAuthProvider.credentialFromResult(result);

            }).catch((error) => {
                const credential = TwitterAuthProvider.credentialFromError(error);
                // console.log(error, " =============== error");
            });
    }

    const getUserData = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userData = {
                    name: userDocSnapshot.data().name,
                    email: userDocSnapshot.data().email,
                    role: userDocSnapshot.data().role,
                };

                return userData;
            } else {
                // console.error('User document does not exist');
                return null;
            }
        } catch (error) {
            // console.error('Error getting user data:', error.message);
            return null;
        }
    };

    return (
        <div className="mt-3 row gap-1">
            <div className="col-lg-4 col-md-4 col-sm-12">
                <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type="button" onClick={signInWithGoogle} disabled={loading == "Signing Up" ? true : false}>
                    {
                        loading == "Signing Up" ?
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            : "Sign Up with Google"
                    }
                </button>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
                <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type="button" onClick={signInWithMicrosoft} disabled={loading == "Signing Up" ? true : false}>
                    {
                        loading == "Signing Up" ?
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            : "Sign Up with Microsoft"
                    }
                </button>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
                <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type="button" onClick={signInWithApple} disabled={loading == "Signing Up" ? true : false}>
                    {
                        loading == "Signing Up" ?
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            : "Sign Up with Apple"
                    }
                </button>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">

            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">

            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
                <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type="button" onClick={signInWithTwitter} disabled={loading == "Signing Up" ? true : false}>
                    {
                        loading == "Signing Up" ?
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            : "Sign Up with Twitter"
                    }
                </button>
            </div>
        </div>
    )
}

export default SocialProviders