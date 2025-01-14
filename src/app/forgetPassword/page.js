'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {Spinner} from 'react-bootstrap';
import Link from 'next/link';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { auth, db } from '../../../firebaseConfig';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgetPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    // const checkEmailExists = async (event) => {
    //     event.preventDefault();
    //     setLoading(true);
    //     try {
    //         const querySnapshot = await getDocs(query(
    //             collection(db, "emails"),
    //             where("email", "==", email),
    //             limit(1)
    //         ));

    //         console.log(querySnapshot, " ========== querySnapshot");

    //         if (querySnapshot.empty) {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Email does not exist",
    //                 text: "Please enter a valid email",
    //             });

    //             setLoading(false);
    //         } else {
    //             sendOTP();
    //         }
    //     } catch (error) {
    //         setLoading(false);
    //         Swal.fire({
    //             icon: "error",
    //             title: "An error occurred while checking email",
    //             text: "Please try again later",
    //         });

    //         console.error("Error checking email:", error);
    //     }
    // };

    const sendOTP = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const otp = Math.floor(100000 + Math.random() * 900000);

            await sendPasswordResetEmail(auth, email).then(() => {
                alert("Password Reset link sent");
            });

            router.push(`/verifyOTP?email=${email}`);
        }
        catch (error) {
            console.error("Error sending OTP:", error);
            Swal.fire({
                icon: "error",
                title: "An error occurred while sending OTP",
                text: "Please try again later",
            });
        }
        setLoading(false);
    };

    return (
        <section className="login-container px-5">
            {modalVisible && (
                <div className="modal-auth">
                    <div className="modal-auth-content px-5">
                        <h5 className='text-center py-3'>Forget Password</h5>
                        <Form onSubmit={sendOTP}>
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
                            <Button disabled={loading} className="custom-submit-button" type='submit'>
                                {loading ? <Spinner className='spinner-color-white' animation="border" role="status" style={{ width: '1.5rem', height: '1.5rem' }} /> : "Send OTP"}
                            </Button>
                        </Form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ForgetPassword;
