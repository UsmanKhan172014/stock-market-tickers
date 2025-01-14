'use client';
import AppLayout from '@/components/mainLayouts/AppLayout';
import Image from 'next/image';
import React, { useEffect, useState, useRef } from 'react';
import { Col, Nav, NavItem, NavLink, Row, Spinner, TabContent, TabPane } from 'reactstrap';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { fetchSpecificTicker } from '@/api/stocks';
import { createChart } from 'lightweight-charts';
import Swal from 'sweetalert2';
import { checkIfTickerExists } from '@/api/watchlist';
import AddToWatchListBtn from '@/components/AddToWatchListBtn';
import FinancialsTab from '@/components/tabsContent/FinancialsTab/FinancialsTab';
import GraphTimeDuration from '@/components/tabsContent/OverviewTab/GraphTimeDuration';
import OverviewTabTable from '@/components/tabsContent/OverviewTab/OverviewTabTable';

import { restClient } from '@polygon.io/client-js';
import ProfileTab from '@/components/tabsContent/ProfileTab/ProfileTab';
import GeminiAIContent from '@/components/tabsContent/OverviewTab/GeminiAIContent';
import FinancialTabTable from '@/components/tabsContent/FinancialsTab/FinancialTabTable';
import fetchGeminiResponse from '@/api/geminiApi';

const polygonClient = restClient(process.env.NEXT_PUBLIC_POLYGON_API_KEY);

const StockDetails = () => {
    const targetRef = useRef(null);

    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [imgUrl, setImageUrl] = useState("");
    const [isTickerExists, setIsTickerExists] = useState(false);
    const [watchListLoading, setWatchListLoading] = useState(false);

    const [graphLoading, setGraphLoading] = useState(true);
    const [activeGraphButton, setActiveGraphButton] = useState("");
    const [chart, setChart] = useState(null);
    const [areaSeries, setAreaSeries] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [tickerStats, setTickerStats] = useState({});
    const [isPriceUp, setIsPrhgiceUp] = useState(null);
    const [percentageChange, setPercentageChange] = useState(null);

    const [graphButtonName, setGraphButtonName] = useState("first");
    const [graphUnitType, setGraphUnitType] = useState("day");
    const [graphNoOfUnits, setGraphNoOfUnits] = useState(1);

    const [isTickerError, setIsTickerError] = useState(false);
    const [tickerMarket, setTickerMarket] = useState("");

    const [companyName, setCompanyName] = useState("");

    const [textResponse, setTextResponse] = useState("");
    const [AILoading, setAILoading] = useState(false);
    const [showAIResponse, setShowAIResponse] = useState(false);

    const pathname = usePathname();
    const segments = pathname?.split('/');
    const ticker = segments.pop();
    const chartContainerRef = useRef(null);

    const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

    useEffect(() => {
        if (ticker) {
            fetchData();
            checkTickerInWatchList();
        }
    }, [ticker]);

    useEffect(() => {
        if (chartContainerRef.current && !chart) {
            fetchGraphDataHandler(graphNoOfUnits, graphUnitType, graphButtonName, false);
        }
    }, [chartContainerRef.current]);

    useEffect(() => {
        if (!isTickerError) {
            const interval = setInterval(() => {
                fetchGraphDataHandler(graphNoOfUnits, graphUnitType, graphButtonName, true);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [graphNoOfUnits, graphUnitType, graphButtonName, isTickerError]);

    const fetchData = async () => {
        try {
            const stock = await fetchSpecificTicker(ticker);
            setData(stock);

            setTickerMarket(stock?.tickerInfo?.results?.market);
            setCompanyName(stock?.tickerInfo?.results?.name);

            if (stock?.tickerInfo?.results?.branding?.icon_url) {

                const authenticatedUrl = `${stock.tickerInfo.results.branding.icon_url}?apiKey=${API_KEY}`
                setImageUrl(authenticatedUrl);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error fetching data",
                text: error.message
            });
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    }

    const checkTickerInWatchList = async () => {
        setWatchListLoading(true);
        const exists = await checkIfTickerExists(ticker);
        if (exists) {
            setIsTickerExists(true);
        }
        setWatchListLoading(false);
    }

    const fetchGraphDataHandler = (noOfUnits, unitType, buttonName, callUsingSocket) => {
        if (!callUsingSocket) {
            setGraphLoading(true);
        }
        setGraphNoOfUnits(noOfUnits);
        setGraphUnitType(unitType);
        setGraphButtonName(buttonName);

        fetchGraphData(noOfUnits, unitType, buttonName);
    }

    const fetchGraphData = async (noOfUnits, unitType, buttonName) => {
        const endDate = new Date();
        let startDate;
        let aggregatesIn;
        let aggregateLength;

        switch (unitType) {
            case 'day':
                startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - noOfUnits);
                aggregateLength = 1;
                aggregatesIn = "minute"
                break;
            case 'week':
                startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - (noOfUnits * 7));
                aggregateLength = 10;
                aggregatesIn = "minute"
                break;
            case 'month':
                startDate = new Date(endDate);
                startDate.setMonth(endDate.getMonth() - noOfUnits);
                aggregateLength = 10;
                aggregatesIn = "minute";
                break;
            case 'year':
                startDate = new Date(endDate);
                startDate.setFullYear(endDate.getFullYear() - noOfUnits); aggregateLength = 1;
                aggregateLength = 1;
                aggregatesIn = "day"
                break;
            default:
                break;
        }

        const endDateString = endDate.toISOString().split('T')[0];
        const startDateString = startDate.toISOString().split('T')[0];

        setActiveGraphButton(buttonName);

        try {
            const response = await polygonClient.stocks.aggregates(ticker, aggregateLength, aggregatesIn, startDateString, endDateString);
            initializeChart(response.results);

        } catch (error) {
            setIsTickerError(true);
            Swal.fire({
                icon: "error",
                title: "Error fetching graph data",
                text: "Sorry, Graph Data is not available.",
            });
            console.error('Error fetching graph data:', error);
        } finally {
            setGraphLoading(false);
        }
    };

    const initializeChart = (data) => {
        const sortedData = data?.sort((a, b) => a.t - b.t);

        const initialChartData = sortedData?.map(result => ({
            time: result.t / 1000,
            value: result.v
        }));

        const last_object = sortedData[sortedData.length - 1];
        setTickerStats(last_object);

        if (last_object?.c != null && last_object?.o != null) {
            const change = ((last_object.c - last_object.o) / last_object.o) * 100;
            setPercentageChange(change.toFixed(2));
            setIsPriceUp(last_object.c > last_object.o);
        }

        setChartData(initialChartData);

        const chartContainer = chartContainerRef.current;
        if (!chartContainer) return;

        chartContainer.innerHTML = '';

        const chartOptions = {
            layout: { textColor: 'black', background: { type: 'solid', color: 'white' } }
        };

        const newChart = createChart(chartContainer, chartOptions);
        const newAreaSeries = newChart?.addAreaSeries({
            topColor: 'rgba(0, 150, 136, 0.56)',
            bottomColor: 'rgba(0, 150, 136, 0.04)',
            lineColor: 'rgba(0, 150, 136, 1)',
            lineWidth: 2,
        });

        newAreaSeries.setData(initialChartData);

        setChart(newChart);
        setAreaSeries(newAreaSeries);
    };

    const generateAiReport = async (event) => {
        event.preventDefault();
        try {
            setAILoading(true);
            if (targetRef.current) {
                targetRef.current.scrollIntoView({ behavior: 'smooth' });
            }

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

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    return (
        <AppLayout>
            <div className='main-layout-container h-100 py-3'>
                <div className="card components-main-card">
                    <Row className='py-3 bg-white single-ticker-name-detail m-0'>
                        <Col lg={9} md={9} sm={12} className="px-3">
                            <Row className="gx-1">
                                <Col lg={6} md={10} sm={12} className='d-flex align-items-center ticker-name-image'>
                                    {imgUrl !== "" ? (
                                        <Image
                                            src={imgUrl}
                                            alt="Stock Icon"
                                            width={57}
                                            height={57}
                                            priority
                                        />
                                    ) : (<></>)
                                    }
                                    <h5 className='stock-detail-stock-name mb-0 ms-2' title={data?.tickerInfo?.results?.name}>
                                        {data?.tickerInfo?.results?.name && data?.tickerInfo?.results?.name.slice(0, 50) + (data?.tickerInfo?.results?.name.length > 50 ? "..." : "")}
                                    </h5>
                                </Col>
                                <Col lg={5} md={12} sm={12}>
                                    <div className="d-flex align-items-center">
                                        <h5 className='mb-0 me-3 stock-detail-current-price'>
                                            {tickerStats?.vw?.toFixed(2) ?? "n/a"}
                                        </h5>
                                        {percentageChange !== null && isPriceUp !== null ? (
                                            <h5 className={`mb-0 stock-detail-up-and-down d-flex align-items-center ${isPriceUp ? 'text-success' : 'text-danger'}`}>
                                                {percentageChange}%
                                                <FontAwesomeIcon className='ms-2' icon={isPriceUp ? faArrowUp : faArrowDown} />
                                            </h5>
                                        ) : (
                                            <h5 className='mb-0 stock-detail-up-and-down d-flex align-items-center text-muted'>
                                                Loading...
                                            </h5>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={3} md={3} sm={12} className='d-flex justify-content-end align-items-start'>
                            <AddToWatchListBtn
                                data={data?.tickerInfo}
                                isTickerExists={isTickerExists}
                                setIsTickerExists={setIsTickerExists}
                                watchListLoading={watchListLoading}
                                setWatchListLoading={setWatchListLoading}
                            />
                        </Col>
                    </Row>
                    <Nav pills>
                        <NavItem>
                            <NavLink
                                className={activeTab === '1' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('1')}
                            >
                                Overview
                            </NavLink>
                        </NavItem>
                        <NavItem className={`${tickerMarket == "crypto" ? "d-none" : ""}`}>
                            <NavLink
                                className={activeTab === '2' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('2')}
                            >
                                Financials
                            </NavLink>
                        </NavItem>
                        {/* <NavItem>
                            <NavLink
                                className={activeTab === '3' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('3')}
                            >
                                Statistics
                            </NavLink>
                        </NavItem>
                        */}
                        <NavItem className={`${tickerMarket == "crypto" ? "d-none" : ""}`}>
                            <NavLink
                                className={activeTab === '4' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('4')}
                            >
                                Profile
                            </NavLink>
                        </NavItem>
                        {/* <NavItem>
                            <NavLink
                                className={activeTab === '5' ? 'active news-tab-active' : 'news-tab-inactive '}
                                onClick={() => toggle('5')}
                            >
                                Chart
                            </NavLink>
                        </NavItem>  */}
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
                            ) : ((
                                <Row>
                                    <Col lg="3" md="4" sm="12">
                                        <OverviewTabTable ticker={ticker} tickerMarket={tickerMarket} />
                                    </Col>
                                    <Col lg="9" md="8" sm="12">
                                        <div className="mb-3">
                                            <div>
                                                <Row>
                                                    <Col>
                                                        <button
                                                            className='btn add-to-watchList-btn float-end'
                                                            onClick={generateAiReport}
                                                        >
                                                            Create AI Equity Report
                                                        </button>
                                                    </Col>
                                                </Row>

                                            </div>

                                            <GraphTimeDuration
                                                activeGraphButton={activeGraphButton}
                                                fetchGraphDataHandler={fetchGraphDataHandler}
                                            />
                                            <div className="mt-5 graph-main-container">
                                                {graphLoading && (
                                                    <div className='my-5 d-flex justify-content-center align-items-center position-absolute w-100 h-100' style={{ top: 0, left: 0, zIndex: 10, background: 'rgba(255, 255, 255, 0.8)' }}>
                                                        <Spinner
                                                            className='spinner-color-orange'
                                                            animation="border"
                                                            role="status"
                                                            style={{ width: '2.5rem', height: '2.5rem' }}
                                                        />
                                                    </div>
                                                )}
                                                <div id="areaChart" className='chart-container' ref={chartContainerRef}></div>
                                            </div>
                                        </div>
                                        <div ref={targetRef}>
                                            {setShowAIResponse &&
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
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </TabPane>

                        <TabPane className={`bg-white ${tickerMarket == "crypto" ? "d-none" : ""}`} tabId="2">
                            <Row>
                                <Col lg="3" md="4" sm="12">
                                    <FinancialTabTable data={data} tickerStats={tickerStats} />
                                </Col>
                                <Col lg="9" md="8" sm="12">

                                    <FinancialsTab ticker={ticker} />
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane className={`bg-white ${tickerMarket == "crypto" ? "d-none" : ""}`} tabId="4">
                            <ProfileTab ticker={ticker} />
                        </TabPane>

                        {/* <TabPane className='bg-white' tabId="5">
                            <CandleChart ticker={ticker} data={data} />
                        </TabPane> */}
                    </TabContent>
                </div>
            </div >
        </AppLayout >
    )
}
export default StockDetails;