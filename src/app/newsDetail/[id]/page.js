'use client'
import AppLayout from '@/components/mainLayouts/AppLayout';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Card, CardBody, CardImg, CardText, CardTitle, Col, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane } from 'reactstrap';

const NewsDetail = () => {
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(false);

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <AppLayout>
            <div className='main-layout-container container-fluid h-100 py-3'>
                <div className="card px-4 components-main-card">
                    <Row>
                        <Col lg="9" md="8" sm="12">
                            <Card className="py-0 no-border-card">
                                <h5 className='news-details-title'>News</h5>
                                <div className="w-100 d-flex">
                                    <p className="news-detail-date pe-3 mb-0">
                                        12 hours ago
                                    </p>
                                    <div className="d-flex">
                                        <p className='news-detail-author mb-0'>
                                            By Carolina Cassey
                                        </p>
                                        <p className="vertical-divider mx-2 mb-0"></p>
                                        <p className='news-detail-author mb-0'>
                                            4min read
                                        </p>
                                    </div>
                                </div>
                                <CardBody className='px-0'>
                                    <p className='new-detail-text'>
                                        vel Quisque vitae Ut id felis, ipsum orci elit malesuada enim. ex elit lacus odio odio lacus malesuada porta Nunc ipsum sapien risus adipiscing dignissim, elit. vitae vel ex at, convallis. ultrices tortor. ipsum amet, dui. odio felis, eget massa dui urna placerat hendrerit Nullam ipsum elementum
                                    </p>
                                    <p className='new-detail-text'>
                                        consectetur vel porta Nullam Ut leo. consectetur sit lobortis, ultrices dignissim, faucibus orci convallis. faucibus non Sed faucibus id vitae placerat. non. amet, dui. ex dui odio placerat eget quam nisl. sollicitudin. cursus turpis tempor Ut sit Nam tempor scelerisque non tincidunt sapien odio
                                    </p>
                                    <p className='new-detail-text'>
                                        ex Cras elit porta leo. quis laoreet elit. amet, ipsum libero, hendrerit massa Ut dui Lorem urna eget consectetur sit lorem. lobortis, dui. tincidunt tincidunt eget eu ac Praesent sapien quis non, urna. tortor. adipiscing lacus sollicitudin. ex turpis Ut elit quam vitae Nunc lacus, ipsum sapien in
                                    </p>
                                    <div className="news-important-part-container">
                                        <h5 className='news-important-part-text'>
                                            vehicula, Praesent nulla, vitae tincidunt Lorem nulla, malesuada tincidunt est. eget felis, eu Donec nulla, tincidunt tortor. vitae nibh faucibus at, Quisque
                                        </h5>
                                    </div>
                                    <Row className='mt-3 justify-content-center'>
                                        <Col lg={8} md={8} sm={12}>
                                            <Image
                                                src="/assets/images/news-detail-image.png"
                                                alt="News Detail Image"
                                                layout="responsive"
                                                width={560} height={319} priority
                                            />
                                            <p className='new-detail-image-text'>
                                                The casket of late U.S. Rep. John Lewis, a pioneer of the civil rights movement who died July 17, is carried outside the Brown Chapel A.M.E. Church, in Selma, Ala., on July 26, 2020. &nbsp; &nbsp;
                                                <span className='new-detail-image-text-author'>
                                                    Christopher Aluka Berry / Reuters
                                                </span>
                                            </p>
                                        </Col>
                                    </Row>
                                    <p className='new-detail-text'>
                                        lorem. non non volutpat Ut Nam varius elit lobortis, ac turpis vitae leo. tortor. cursus consectetur quis elit. eget porta lobortis, hendrerit vitae urna non ultrices Praesent Nam luctus vel leo. convallis. at ac malesuada Ut elit vitae
                                    </p>
                                    <p className='new-detail-text'>
                                        placerat vitae quam non Nunc sit Nunc venenatis non. odio facilisis commodo at, quis lacus volutpat nisi placerat. elementum Ut malesuada turpis placerat. luctus convallis. in nisl. sodales. malesuada lacus nec id nibh ex urna. Cras nec
                                    </p>
                                    <p className='new-detail-text'>
                                        Lorem Donec nibh est. maximus nulla, tincidunt elit elit. risus in Donec sapien Praesent orci ex gravida sit Morbi nisl. tincidunt Praesent Lorem Nunc lorem. viverra commodo dolor Ut viverra gravida odio nulla, tincidunt in est. nisl. at,
                                    </p>
                                    <p className='new-detail-text'>
                                        elit. placerat. ipsum Lorem vel placerat. Lorem nec nibh vehicula, tempor eget luctus dolor sed urna. tincidunt sit cursus Quisque eget felis, tincidunt elit. commodo dolor tortor. sit id tempor Morbi Ut Morbi luctus placerat urna. lacus
                                    </p>
                                    <Row className='mt-3 justify-content-center'>
                                        <Col lg={8} md={8} sm={12}>
                                            <Image
                                                src="/assets/images/news-detail-image-2.png"
                                                alt="News Detail Image"
                                                layout="responsive"
                                                width={560} height={319} priority
                                            />
                                            <p className='new-detail-image-text'>
                                                The casket of late U.S. Rep. John Lewis, a pioneer of the civil rights movement who died July 17, is carried outside the Brown Chapel A.M.E. Church, in Selma, Ala., on July 26, 2020. &nbsp; &nbsp;
                                                <span className='new-detail-image-text-author'>
                                                    Christopher Aluka Berry / Reuters
                                                </span>
                                            </p>
                                        </Col>
                                    </Row>
                                    <p className='new-detail-text'>
                                        Nulla sit amet venenatis odio. Praesent a ultrices libero. Quisque maximus mauris non feugiat imperdiet. Maecenas ultrices tempus dolor. Curabitur ultricies velit ut purus pretium, et scelerisque neque rutrum. condimentum euismod ac sit amet urna. Cras vehicula, ligula non cursus luctus, odio augue sollicitudin ipsum, eu fringilla lorem ipsum a enim.
                                    </p>
                                    <p className='new-detail-text'>
                                        Vestibulum elementum enim consequat est cursus pulvinar. Maecenas posuere sapien at faucibus posuere. Morbi dictum eget ex sed hendrerit. Pellentesque a aliquam erat, id aliquet nisi. Integer ut mauris.
                                    </p>
                                    <p className='new-detail-text'>
                                        Maecenas in orci leo. Vestibulum non ante libero. Vivamus nec ipsum turpis. Aenean suscipit lacinia metus semper mattis. Pellentesque tempus lectus sit amet justo malesuada imperdiet. Cras consectetur metus at erat ornare fringilla. Praesent malesuada tellus ut velit euismod, nec ultrices ipsum cursus.
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="3" md="4" sm="12">
                            <Card className="px-0 no-border-card">
                                <p className='recommended-news'>Recommended For You</p>
                                <Link className='new-detail-link' href={"/newsDetail/12"}>
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
                                <Link className='new-detail-link' href={"/newsDetail/13"}>
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
                                <Link className='new-detail-link' href={"/newsDetail/14"}>
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
                                <Link className='new-detail-link' href={"/newsDetail/15"}>
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
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </AppLayout>
    )
}

export default NewsDetail