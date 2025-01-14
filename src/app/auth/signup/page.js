'use client'
import React, { useState } from 'react';
import { auth } from '../../../../firebaseConfig';
import Link from 'next/link';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {Spinner} from 'react-bootstrap';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import CenteredLine from '@/components/CenteredLine';
import GoogleAuthProvider from '@/components/auth/GoogleAuthProvider';
import FacebookAuthProvider from '@/components/auth/FacebookAuthProvider';
import GithubAuthProviderComp from '@/components/auth/GithubAuthProviderComp';
import TwitterAuthProviderComp from '@/components/auth/TwitterAuthProviderComp';

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential?.user;

            if (newUser) {
                const uid = newUser.uid;

                const db = getFirestore();
                const userDocRef = doc(db, 'users', uid);

                await setDoc(userDocRef, {
                    uid: uid,
                    email: newUser.email,
                    role: 'user',
                });

                const userDocSnapshot = await getDoc(userDocRef);
                const user = {
                    name: userDocSnapshot.data().name,
                    email: userDocSnapshot.data().email,
                    role: userDocSnapshot.data().role
                };

                localStorage.setItem("User", JSON.stringify({ ...user }));
                router.push('/');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Sign up error:', error.message);
            setError(error.message);
        }
    };

    return (
        <section className="px-5">
            {modalVisible && (
                <div className="modal-auth">
                    <div className="modal-auth-content px-5">
                        <h5 className='text-center py-2'>Sign Up</h5>
                        <Form onSubmit={handleSignUp}>
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
                            <FormGroup>
                                <Label for="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    className='none-border-field'
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    type="password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </FormGroup>
                            <Button disabled={loading} className="custom-submit-button">
                                {loading ? <Spinner animation="border" role="status" /> : "Create an account"}
                            </Button>
                        </Form>

                        <CenteredLine text="OR" />

                        <Row className='py-2 justify-content-center'>
                            <p>Or Sign up with</p>
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
                            <p className='me-2'>{"Already have an account?"}</p>
                            <Link href={'/auth/login'}>Sign in</Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Signup;