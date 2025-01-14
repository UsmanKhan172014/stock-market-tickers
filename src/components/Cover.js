// components/Cover.js

import React from 'react';
import { Spinner } from 'react-bootstrap'; // Import the Spinner component
import coverImage from '../../public/assets/images/Cover.png'; // Import the image file
import Image from 'next/image';

const Cover = () => {
    return (
        <div className="overlay">
            <Image
                src={coverImage}
                alt="Cover Image"
                className="coverImage"
                layout='responsive'
            />
            <div className="spinnerContainer">
                <Spinner animation="border" role="status" className="spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        </div>
    );
};

export default Cover;
