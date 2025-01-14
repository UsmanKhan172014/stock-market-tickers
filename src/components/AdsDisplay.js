import { fetchLimitedNews } from '@/api/news';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardImg, CardText, CardTitle, Col, Row, Spinner } from 'reactstrap';

const TopGainersAndLosers = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newsError, setNewsError] = useState("");

    useEffect(() => {
        async function fetchExchanges() {
            try {
                const response = await fetchLimitedNews();

                setNews(response?.results);

                setLoading(false);
            } catch (error) {
                setLoading(false);
                setNewsError("No latest news data available");
                console.log(error, " ===== news error");
            }
        }

        fetchExchanges();
    }, []);

    return (
        <div className='adsDiv px-1'>
            {loading ? (
                <Row className='my-5 justify-content-center align-items-center'>
                    <Spinner
                        className='spinner-color-orange'
                        animation="border"
                        role="status"
                        style={{ width: '2.5rem', height: '2.5rem' }}
                    />
                </Row>
            ) : (
                <>
                    {news && news?.map((news, index) => (
                        <Link key={index} target='_blank' href={news?.article_url ?? ""} className='new-detail-link'>
                            <Card className="my-2 p-0 no-border-card h-100">
                                {news?.image_url ?
                                    (<CardImg
                                        alt="Card image cap"
                                        src={news?.image_url}
                                        style={{
                                            height: 150,
                                            background: 'black'
                                        }}
                                        top
                                        width="100%"
                                        priority
                                    />) : (
                                        <CardImg
                                            alt="Card image cap"
                                            src="/assets/images/NewsCard.png"
                                            style={{
                                                height: 180
                                            }}
                                            top
                                            width="100%"
                                        />
                                    )}
                                <CardBody className='px-0 pb-0'>
                                    <CardTitle tag="h5" className='new-card-title'>
                                        {news?.title}
                                    </CardTitle>
                                    <CardText className='news-card-para' title={news?.description}>
                                        {news?.description && news?.description.split(' ').slice(0, 30).join(' ') + (news?.description.split(' ').length > 30 ? "..." : "")}
                                    </CardText>
                                </CardBody>
                            </Card>
                        </Link>
                    ))}
                </>
            )}
        </div>
    );
};

export default TopGainersAndLosers
