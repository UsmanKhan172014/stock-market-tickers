import React, { useState, useRef } from 'react';

const OtpInput = ({ numInputs = 6, onChange, onComplete }) => {
    const [otpValues, setOtpValues] = useState(Array(numInputs).fill(''));
    const inputRefs = useRef([]);

    // Handle input change
    const handleInputChange = (index, value) => {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Trigger onChange callback
        if (onChange) {
            onChange(newOtpValues.join(''));
        }

        // Trigger onComplete callback when all inputs are filled
        const filled = newOtpValues.every((val) => val !== '');
        if (filled && onComplete) {
            onComplete(newOtpValues.join(''));
        }

        // Focus next input if available
        if (value !== '' && index < numInputs - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle input key press (focus previous input on Backspace)
    const handleInputKeyPress = (index, e) => {
        if (e.key === 'Backspace' && index > 0 && otpValues[index] === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="otp-input-container">
            {Array(numInputs)
                .fill('')
                .map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={otpValues[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleInputKeyPress(index, e)}
                        ref={(input) => (inputRefs.current[index] = input)}
                        className="otp-input"
                    />
                ))}
        </div>
    );
};

export default OtpInput;
