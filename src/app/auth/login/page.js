'use client'
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import {Spinner} from 'react-bootstrap';
import Link from 'next/link';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import CenteredLine from '@/components/CenteredLine';
import GoogleAuthProvider from '@/components/auth/GoogleAuthProvider';
import FacebookAuthProvider from '@/components/auth/FacebookAuthProvider';
import GithubAuthProviderComp from '@/components/auth/GithubAuthProviderComp';
import TwitterAuthProviderComp from '@/components/auth/TwitterAuthProviderComp';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const uid = user.uid;
            const userData = await getUserData(uid);
            if (userData?.role === "admin" || userData?.role === "user") {
                router.push('/');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Login error:', error.message);
        }
    };

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
                console.error('User document does not exist');
                return null;
            }
        } catch (error) {
            console.error('Error getting user data:', error.message);
            return null;
        }
    };

    return (
        <section className="login-container px-5">
            {modalVisible && (
                <div className="modal-auth">
                    <div className="modal-auth-content px-5">
                        <h5 className='text-center py-2'>Sign In</h5>
                        <Form onSubmit={handleLogin}>
                            <FormGroup>
                                <Label for="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    className='none-border-field'
                                    name="email"
                                    placeholder="Your email address"
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    className='none-border-field'
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormGroup>
                            <p className='text-end mt-0'><Link href={'/forgetPassword'}>Forget Password?</Link></p>

                            <Button disabled={loading} className="custom-submit-button d-flex align-items-center justify-content-center">
                                {loading ?
                                    <Spinner className='spinner-color-white' animation="border" role="status" style={{ width: '1.5rem', height: '1.5rem' }} />
                                    :
                                    "Sign in"
                                }
                            </Button>
                        </Form>

                        <CenteredLine text="OR" />

                        <p>Or Sign in with</p>

                        <Row className='py-2 justify-content-center'>
                            <Col lg={4} md={4} sm={12}>
                                <GoogleAuthProvider />
                            </Col>
                            <Col lg={4} md={4} sm={12}>
                                <FacebookAuthProvider />
                            </Col>
                            <Col lg={4} md={4} sm={12}>
                                <GithubAuthProviderComp />
                            </Col>
                            <Col lg={4} md={4} sm={12} className='mt-2'>
                                <TwitterAuthProviderComp />
                            </Col>
                        </Row>

                        <div className="d-flex py-3 justify-content-center">
                            <p className='me-2'>{"Don't have an account?"}</p>
                            <Link href={'/auth/signup'}>Sign Up</Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Login;
