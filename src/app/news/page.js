'use client'
import { fetchAllNews, fetchPaginatedNews } from '@/api/news';
import AppLayout from '@/components/mainLayouts/AppLayout';
import { formatTimestamp } from '../../utils/CommonFunctions';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardImg, CardText, CardTitle, Col, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane } from 'reactstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const News = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(true);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);
    const [nextUrl, setNextUrl] = useState("");
    const [data, setData] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem('newsData');
        const savedNextUrl = localStorage.getItem('newsNextUrl');

        if (savedData) {
            setData(JSON.parse(savedData));
            setNextUrl(savedNextUrl);
            setLoading(false);
        } else {
            fetchData();
        }
    }, []);

    const fetchData = async (nextApiUrl) => {
        try {
            let allNews;
            if (nextApiUrl) {
                setLoadMoreLoading(true);

                allNews = await fetchPaginatedNews(nextApiUrl);
                setData(prevData => {
                    const newData = [...prevData, ...allNews?.results];
                    localStorage.setItem('newsData', JSON.stringify(newData));
                    return newData;
                });
            } else {
                setLoading(true);
                allNews = await fetchAllNews();
                setData(allNews?.results);
            }

            const newNextUrl = allNews?.next_url;
            setNextUrl(newNextUrl);
            localStorage.setItem('newsNextUrl', newNextUrl);

            setLoading(false);
            setLoadMoreLoading(false);
        } catch (error) {
            setLoading(false);
            setLoadMoreLoading(false);

            Swal.fire({
                icon: "error",
                title: "Oops, An Error occurred",
                text: error.message,
            });
            console.error('Error fetching data:', error);
        }
    }

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <AppLayout>
            <div className='container h-100 py-3' style={{ flexDirection: 'column' }}>
                <div className="card px-4 components-main-card">
                    <div className="d-flex justify-content-end">
                        <span className='refresh-news d-flex' onClick={() => fetchData()}>
                            REFRESH NEWS
                        </span>
                    </div>
                    <Nav pills>
                        <NavItem>
                            <NavLink
                                className={activeTab === '1' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('1')}
                            >
                                Stocks News
                            </NavLink>
                        </NavItem>
                        {/* <NavItem>
                            <NavLink
                                className={activeTab === '2' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('2')}
                            >
                                Crypto News
                            </NavLink>
                        </NavItem> */}
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        <TabPane className='bg-white' tabId="1">
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
                                    {data && data?.map((news, index) => (
                                        <Col lg="3" md="4" sm="12" key={index} className='mb-3'>
                                            <Link target='_blank' href={news?.article_url ?? ""} className='new-detail-link'>
                                                <Card className="my-2 p-0 no-border-card h-100">
                                                    {news?.image_url ?
                                                        (<CardImg
                                                            alt="Card image cap"
                                                            src={news?.image_url}
                                                            style={{
                                                                height: 180,
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
                                                    <CardFooter className='news-card-footer'>
                                                        <small className="text-muted new-card-date-text">
                                                            {formatTimestamp(news?.published_utc)}
                                                        </small>
                                                    </CardFooter>
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))}
                                    {nextUrl && nextUrl !== "" ? (
                                        <div className="d-flex justify-content-center">
                                            <span className='show-paginated-news d-flex' onClick={() => fetchData(nextUrl)}>
                                                {loadMoreLoading ? (
                                                    <Spinner
                                                        className='spinner-color-orange'
                                                        animation="border"
                                                        role="status"
                                                        style={{ width: '2rem', height: '2rem' }}
                                                    />
                                                ) : (
                                                    <>
                                                        LOAD MORE &nbsp;
                                                        <FontAwesomeIcon icon={faCaretDown} color='#D15C0D' />
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    ) : ""}
                                </Row>
                            )}
                        </TabPane>
                        {/* <TabPane className='bg-white' tabId="2">
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
                                    <Col lg="3" md="4" sm="12">
                                        <Link className='new-detail-link' href={"/newsDetail/9"}>
                                            <Card className="my-2 p-0 no-border-card">
                                                <CardImg
                                                    alt="Card image cap"
                                                    src="/assets/images/NewsCard.png"
                                                    style={{
                                                        height: 180
                                                    }}
                                                    top
                                                    width="100%"
                                                />
                                                <CardBody className='px-0'>
                                                    <CardTitle tag="h5" className='new-card-title'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    </CardTitle>
                                                    <CardText className='news-card-para'>
                                                        Integer ullamcorper lacinia sapien quis tincidunt. Aenean odio purus, fermentum ut pulvinar ut, blandit eu metus.
                                                    </CardText>
                                                    <CardText>
                                                        <small className="text-muted new-card-date-text">
                                                            3 hours ago . 8 min read
                                                        </small>
                                                    </CardText>
                                                </CardBody>
                                            </Card>
                                        </Link>
                                    </Col>
                                    <Col lg="3" md="4" sm="12">
                                        <Link className='new-detail-link' href={"/newsDetail/10"}>
                                            <Card className="my-2 p-0 no-border-card">
                                                <CardImg
                                                    alt="Card image cap"
                                                    src="/assets/images/NewsCard.png"
                                                    style={{
                                                        height: 180
                                                    }}
                                                    top
                                                    width="100%"
                                                />
                                                <CardBody className='px-0'>
                                                    <CardTitle tag="h5" className='new-card-title'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    </CardTitle>
                                                    <CardText className='news-card-para'>
                                                        Integer ullamcorper lacinia sapien quis tincidunt. Aenean odio purus, fermentum ut pulvinar ut, blandit eu metus.
                                                    </CardText>
                                                    <CardText>
                                                        <small className="text-muted new-card-date-text">
                                                            3 hours ago . 8 min read
                                                        </small>
                                                    </CardText>
                                                </CardBody>
                                            </Card>
                                        </Link>
                                    </Col>
                                    <Col lg="3" md="4" sm="12">
                                        <Link className='new-detail-link' href={"/newsDetail/11"}>
                                            <Card className="my-2 p-0 no-border-card">
                                                <CardImg
                                                    alt="Card image cap"
                                                    src="/assets/images/NewsCard.png"
                                                    style={{
                                                        height: 180
                                                    }}
                                                    top
                                                    width="100%"
                                                />
                                                <CardBody className='px-0'>
                                                    <CardTitle tag="h5" className='new-card-title'>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    </CardTitle>
                                                    <CardText className='news-card-para'>
                                                        Integer ullamcorper lacinia sapien quis tincidunt. Aenean odio purus, fermentum ut pulvinar ut, blandit eu metus.
                                                    </CardText>
                                                    <CardText>
                                                        <small className="text-muted new-card-date-text">
                                                            3 hours ago . 8 min read
                                                        </small>
                                                    </CardText>
                                                </CardBody>
                                            </Card>
                                        </Link>
                                    </Col>
                                </Row>
                            )}
                        </TabPane> */}
                    </TabContent>
                </div>
            </div>
        </AppLayout>
    )
}

export default News