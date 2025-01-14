import fetchGeminiResponse from '@/api/geminiApi';
import React, { useEffect, useState } from 'react';
import { Row, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';

const GeminiAIContent = ({ ticker, companyName }) => {
    const [textResponse, setTextResponse] = useState("");
    const [AILoading, setAILoading] = useState(false);

    useEffect(() => {
        if (ticker && companyName) {
            generateAiReport();
        }
    }, [ticker]);

    const generateAiReport = async () => {
        try {
            setAILoading(true);
            const response = await fetchGeminiResponse(ticker, companyName);
            setTextResponse(response);
            setAILoading(false);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error fetching data from Gemini AI",
                text: error.message
            });
            console.error('Error fetching data:', error);
        }
    }

    const cleanText = (text) => {
        return text.replace(/\*\*/g, '');
    }

    const renderContent = () => {
        if (!textResponse) return null;

        // Split the response into lines and filter out unwanted lines
        const lines = textResponse.split('\n');

        // Parse the lines into structured content
        const content = [];
        let currentSection = null;

        lines.forEach(line => {
            if (line.startsWith('##')) {
                // Main heading
                currentSection = {
                    type: 'main',
                    title: cleanText(line.replace('## ', '')),
                    content: []
                };
                content.push(currentSection);

            } else if (line.startsWith('**')) {
                // Subheading
                currentSection.content.push({
                    type: 'sub',
                    title: cleanText(line.replace('**', '').trim()),
                    content: []
                });
            } else if (line.startsWith('*')) {
                // List item
                const lastSubSection = currentSection.content[currentSection.content.length - 1];
                if (lastSubSection && lastSubSection.type === 'sub') {
                    if (!lastSubSection.list) {
                        lastSubSection.list = [];
                    }
                    lastSubSection.list.push(cleanText(line.replace('*', '').trim()));
                }
            } else {
                // Paragraph
                const lastSubSection = currentSection.content[currentSection.content.length - 1];

                if (lastSubSection && lastSubSection.type === 'sub') {
                    lastSubSection.content.push(cleanText(line.trim()));
                }
            }
        });

        return content.map((section, index) => (
            <div key={index}>
                <h5 className='news-details-title mb-0'>
                    Equity Research Report: {companyName} ({ticker})
                </h5>
                <small className='text-muted'>
                    {section.title}
                </small>
                {section.content.map((subSection, subIndex) => (
                    <div key={subIndex}>
                        <h3 className='news-details-title mb-0'>{subSection.title}</h3>
                        {subSection.content.map((paragraph, paraIndex) => (
                            <p className='new-detail-text' key={paraIndex}>{paragraph}</p>
                        ))}
                        {subSection.list && (
                            <ul>
                                {subSection.list.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        ));
    };

    return (
        <div>
            {AILoading ? (
                <Row className='my-5 justify-content-center'>
                    <Spinner
                        className='spinner-color-orange'
                        animation="border"
                        role="status"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    />
                </Row>
            ) : (
                renderContent()
            )}
        </div>
    );
}

export default GeminiAIContent;