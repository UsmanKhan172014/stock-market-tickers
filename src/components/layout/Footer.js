import Image from 'next/image'
import React from 'react'
import { Col, Row } from 'reactstrap'

export default function Footer() {
    return (
        <footer className="bg-black text-light pt-5 my-0">
            <div className="container">
                <div className="row">
                    <div className="col-md-5 pe-5">
                        <Image src="/assets/icons/GraduationCap.svg" alt="Information" width={60} height={60} priority />
                        <p className='footer-paragraph mt-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore </p>
                        <Row>
                            <Col lg={2} md={3} sm={3} xs={3} className='pb-2'>
                                <Image src="/assets/icons/Facebook.svg" alt="Facebook" width={50} height={50} priority />
                            </Col>
                            <Col lg={2} md={3} sm={3} xs={3} className='pb-2'>
                                <Image src="/assets/icons/Twitter.svg" alt="Twitter" width={50} height={50} priority />
                            </Col>
                            <Col lg={2} md={3} sm={3} xs={3} className='pb-2'>
                                <Image src="/assets/icons/LinkedIn.svg" alt="LinkedIn" width={50} height={50} priority />
                            </Col>
                            <Col lg={2} md={3} sm={3} xs={3} className='pb-2'>
                                <Image src="/assets/icons/Instagram.svg" alt="Instagram" width={50} height={50} priority />
                            </Col>
                        </Row>
                    </div>
                    <div className="col-md-2">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled footer-list">
                            <li><a className='footer-links' href="#">Home</a></li>
                            <li><a className='footer-links' href="#">Terms of Use</a></li>
                            <li><a className='footer-links' href="#">About Us</a></li>
                        </ul>
                    </div>
                    <div className="col-md-2">
                        <h5>Our Terms</h5>
                        <ul className="list-unstyled footer-list">
                            <li><a className='footer-links' href="#">Terms of Use</a></li>
                            <li><a className='footer-links' href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5>Support</h5>
                        <ul className="list-unstyled">
                            <li>
                                <div className="d-flex mt-4">
                                    <Image className='me-2' src="/assets/icons/Call.svg" alt="Phone" width={24} height={24} priority />
                                    <p className='contact-info'>+1 - 202 -55-0179</p>
                                </div>
                            </li>
                            <li>
                                <div className="d-flex mt-4">
                                    <Image className='me-2' src="/assets/icons/Message.svg" alt="Message" width={24} height={24} priority />
                                    <p><a className='footer-links' href="mailto:support@onlinecourse.com">support@onlinecourse.com</a></p>
                                </div>
                            </li>
                            <li>
                                <div className="d-flex mt-4">
                                    <Image className='me-2' src="/assets/icons/Location.svg" alt="Location" width={24} height={24} priority />
                                    <p className='contact-info'>1840 E Garvey Avenue Street West Covina, CA 91791, US</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row mt-4 small-footer">
                    <div className="col-md-12 text-center">
                        <p className='footer-copyrights mb-0'>&copy; 2024 Stock. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
