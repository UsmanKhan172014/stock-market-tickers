import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Spinner } from 'react-bootstrap';
import { Button, Col, Form, FormGroup, Input, Label, Row, Modal } from 'reactstrap';
import CenteredLine from '@/components/CenteredLine';
import GoogleAuthProvider from '@/components/auth/GoogleAuthProvider';
import FacebookAuthProvider from '@/components/auth/FacebookAuthProvider';
import GithubAuthProviderComp from '@/components/auth/GithubAuthProviderComp';
import TwitterAuthProviderComp from '@/components/auth/TwitterAuthProviderComp';
import Swal from 'sweetalert2';

const LoginModal = ({ loginModalVisible, toggleModal, handleSwitchModal, isSmallScreen }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const uid = user.uid;
            const userData = await getUserData(uid);
            toggleModal('login');

            if (userData?.role === "admin" || userData?.role === "user") {
                router.push('/');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);

            Swal.fire({
                icon: "error",
                title: "Failed to login",
                text: error.message,
            });
            console.error('Login error:', error);
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
            Swal.fire({
                icon: "error",
                title: "Error getting user data",
                text: error.message,
            });
            console.error('Error getting user data:', error.message);
            return null;
        }
    };

    return (
        <>
            {loginModalVisible && ((
                <Modal isOpen={loginModalVisible} toggle={() => toggleModal("login")} backdrop={true} keyboard={false}>
                    <div className="modals-layout">
                        <h5 className='text-center py-2 modal-heading'>Sign In</h5>
                        <Form onSubmit={handleLogin}>
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
                            <p className='text-end mt-0 forget-password-link' onClick={() => handleSwitchModal("forgetPasswordModal")}>
                                Forget Password?
                            </p>

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
                            <p className='me-2 mb-0'>{"Don't have an account?"}</p>
                            <p className='modal-link mb-0' onClick={() => handleSwitchModal("signUpModal")}>Sign Up</p>
                        </div>
                    </div>
                </Modal>
            ))}
        </>
    )
}

export default LoginModal