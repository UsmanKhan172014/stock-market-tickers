import React, { useState } from 'react';
import { auth } from '../../../firebaseConfig';
import Link from 'next/link';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {Spinner} from 'react-bootstrap';
import { Button, Col, Form, FormGroup, Input, Label, Modal, Row } from 'reactstrap';
import CenteredLine from '@/components/CenteredLine';
import GoogleAuthProvider from '@/components/auth/GoogleAuthProvider';
import FacebookAuthProvider from '@/components/auth/FacebookAuthProvider';
import GithubAuthProviderComp from '@/components/auth/GithubAuthProviderComp';
import TwitterAuthProviderComp from '@/components/auth/TwitterAuthProviderComp';
import Swal from 'sweetalert2';

const SignUpModal = ({ signUpModalVisible, toggleModal, handleSwitchModal, isSmallScreen }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
                toggleModal('signUp');
                router.push('/');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);

            Swal.fire({
                icon: "error",
                title: "Failed to Sign up",
                text: error.message,
            });
            console.error('Sign up error:', error.message);
            setError(error.message);
        }
    };

    return (
        <>
            {signUpModalVisible && ((
                <Modal isOpen={signUpModalVisible} toggle={() => toggleModal("signUp")} backdrop={true} keyboard={false}>
                    <div className="modals-layout">
                        <h5 className='text-center py-2 modal-heading'>Sign Up</h5>
                        <Form onSubmit={handleSignUp}>
                            <FormGroup>
                                <Label className='modal-label' for="email">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    className='none-border-field modal-input-font'
                                    name="email"
                                    placeholder="Your email address"
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className='modal-label' for="password">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    className='none-border-field modal-input-font'
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className='modal-label' for="confirmPassword">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    className='none-border-field modal-input-font'
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    type="password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </FormGroup>
                            <Button disabled={loading} className="custom-submit-button">
                                {loading ?
                                    <Spinner className='spinner-color-white' animation="border" role="status" style={{ width: '1.5rem', height: '1.5rem' }} />
                                    :
                                    "Create an account"
                                }
                            </Button>
                        </Form>

                        <CenteredLine text="OR" />

                        <Row className='py-2 justify-content-center'>
                            <p>Or Sign up with</p>
                            <Col lg={4} md={4} sm={12} className='social-login-buttons'>
                                <GoogleAuthProvider />
                            </Col>
                            <Col lg={4} md={4} sm={12} className='social-login-buttons'>
                                <FacebookAuthProvider />
                            </Col>
                            <Col lg={4} md={4} sm={12} className='social-login-buttons'>
                                <GithubAuthProviderComp />
                            </Col>
                            <Col lg={4} md={4} sm={12} className={`social-login-buttons ${isSmallScreen ? "" : "mt-2"}`}>
                                <TwitterAuthProviderComp />
                            </Col>
                        </Row>

                        <div className="d-flex py-3 justify-content-center">
                            <p className='me-2 mb-0'>{"Already have an account?"}</p>
                            <p className='modal-link mb-0' onClick={() => handleSwitchModal("signInModal")}>Sign in</p>
                        </div>
                    </div>
                </Modal>
            ))}
        </>
    )
}

export default SignUpModal