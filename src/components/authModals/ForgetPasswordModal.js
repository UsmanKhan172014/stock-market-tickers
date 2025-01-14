import React, { useState } from 'react';
import {Spinner} from 'react-bootstrap';
import { Button, Form, FormGroup, Input, Label, Modal } from 'reactstrap';
import { auth, db } from '../../../firebaseConfig';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { sendPasswordResetEmail } from 'firebase/auth';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ForgetPasswordModal = ({ forgetPasswordModalVisible, toggleModal, handleSwitchModal }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const checkEmailExists = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const querySnapshot = await getDocs(query(
                collection(db, "users"),
                where("email", "==", email),
                limit(1)
            ));

            if (querySnapshot.empty) {
                Swal.fire({
                    icon: "error",
                    title: "Please enter a valid email",
                    text: "Provided email does not exists in our system",
                });

                setLoading(false);
            } else {
                sendOTP();
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Oops",
                text: "An error occurred while checking email",
            });

            console.error("Error checking email:", error);
        }
    };

    const sendOTP = async () => {
        await sendPasswordResetEmail(auth, email).then(() => {
            Swal.fire({
                icon: "success",
                title: "Password Recovery email has been sent to your email.",
            }).then(() => {
                toggleModal("forgetPassword");
            });
        }).error((error) => {
            Swal.fire({
                icon: "error",
                title: "An error occurred while sending email",
                text: "Please try again later",
            });
            console.error("Error sending OTP:", error);
        });
        setLoading(false);
    }

    return (
        <>
            {forgetPasswordModalVisible && ((
                <Modal
                    isOpen={forgetPasswordModalVisible}
                    toggle={() => toggleModal("forgetPassword")}
                    backdrop={true}
                    keyboard={false}
                >
                    <div className="modals-layout">
                        <h5 className='text-center py-3 modal-heading'>Forget Password</h5>
                        <Form onSubmit={checkEmailExists}>
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
                            <Button disabled={loading} className="custom-submit-button" type='submit'>
                                {loading ?
                                    <Spinner className='spinner-color-white' animation="border" role="status" style={{ width: '1.5rem', height: '1.5rem' }} />
                                    :
                                    "Send Email"
                                }
                            </Button>
                            <Button className="btn btn-dark w-100 mt-2" type='button'
                                onClick={() => handleSwitchModal("signInModal")}
                                disabled={loading}
                            >
                                <FontAwesomeIcon className='ms-2' icon={faArrowLeft} /> Go Back
                            </Button>
                        </Form>
                    </div>
                </Modal>
            ))}
        </>
    );
};

export default ForgetPasswordModal;
