import React from 'react';

const CenteredLine = ({ text }) => {
    return (
        <>
            <div className="centeredLine">
                <hr className="line" />
                <span className="text">{text}</span>
                <hr className="line" />
            </div>

            <style jsx>{`
                .centeredLine {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-top: 20px;
                }

                .line {
                  flex-grow: 1;
                  border: 0;
                  border-top: 1px solid gray;
                }

                .text {
                  padding: 0 10px;
                  font-weight: bold;
                  color: #333;
                }
            `}</style>
        </>
    );
};

export default CenteredLine;
