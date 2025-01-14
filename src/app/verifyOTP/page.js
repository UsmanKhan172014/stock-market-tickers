'use client'
import React, { useState } from 'react';
import {Spinner} from 'react-bootstrap';
import Link from 'next/link';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import OtpInput from '@/components/OtpInput';

const VerifyOTP = () => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [otp, setOtp] = useState('');

    const handleOtpChange = (otpValue) => {
        setOtp(otpValue);
    };

    return (
        <section className="login-container px-5">
            {modalVisible && (
                <div className="modal-auth">
                    <div className="modal-auth-content px-5">
                        <h5 className='text-center py-3'>OTP</h5>
                        <p className='py-3'>Vestibulum elementum enim consequat est cursus pulvinar</p>
                        <OtpInput onChange={handleOtpChange} />
                        <Link href={'/changePassword'}>
                            <Button disabled={loading} className="custom-submit-button mt-5">
                                {loading ? <Spinner animation="border" role="status" style={{ width: '10px' }} /> : "Verify"}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            <style jsx>{`
            .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        width: 528px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        position: relative; /* Ensure relative positioning for absolute child (close button) */
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0;
        font-size: 20px;
        color: #333333;
    }
            `}</style>
        </section>
    );
};

export default VerifyOTP;
