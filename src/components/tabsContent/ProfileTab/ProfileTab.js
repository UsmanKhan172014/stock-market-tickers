import { fetchCompanyProfile } from '@/api/alphavantage';
import { millionBillionNotation } from '@/utils/CommonFunctions';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Row, Spinner } from 'reactstrap';

const ProfileTab = ({ ticker }) => {
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        fetchData();
    }, [ticker]);

    const fetchData = async () => {
        try {
            const response = await fetchCompanyProfile(ticker);

            setProfileData(response?.[0]);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            // console.log("-> Profile Data error", error);
        }
    };

    return (
        <>
            {loading ? (
                <Row className='my-5 justify-content-center'>
                    <Spinner
                        className='spinner-color-orange'
                        animation="border"
                        role="status"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    />
                </Row>
            ) : (
                <Row>
                    <Col lg="8" md="7" sm="12">
                        <Card className="py-0 no-border-card">
                            <h5 className='news-details-title'>Company Description</h5>
                            <CardBody className='px-0'>
                                <p className='new-detail-text'>
                                    {profileData?.description}
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4" md="5" sm="12">
                        <Card className="px-0 no-border-card">
                            <CardBody className='px-0'>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        CEO
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.ceo}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        Phone
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.phone}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        Website
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.website}
                                    </p>
                                </div>
                                <div className='mt-4'>
                                    <h5 className='new-card-title mb-0'>
                                        Address
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.address}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        Country
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.country}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        State
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.state}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        City
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.city}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='new-card-title mb-0'>
                                        Zip
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.zip}
                                    </p>
                                </div>
                                <div className='mt-4'>
                                    <h5 className='new-card-title mb-0'>
                                        Industry
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.industry}
                                    </p>
                                </div>
                                <div>
                                    <h5 className='new-card-title mb-0'>
                                        Sector
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.sector}
                                    </p>
                                </div>
                                <div>
                                    <h5 className='new-card-title mb-0'>
                                        Exchange
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.exchange} ({profileData?.exchangeShortName})
                                    </p>
                                </div>
                                <div>
                                    <h5 className='new-card-title mb-0'>
                                        Currency
                                    </h5>
                                    <p className='news-card-para mb-0'>
                                        {profileData?.currency}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default ProfileTab;
