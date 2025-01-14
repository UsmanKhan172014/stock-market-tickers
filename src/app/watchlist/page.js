'use client';
import { getAllWatchListData, getRealTimeData, removeTickerFromWatchList } from '@/api/watchlist';
import DashboardLayout from '@/components/mainLayouts/DashboardLayout';
import { millionBillionNotation } from '@/utils/CommonFunctions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, Col, Input, InputGroup, InputGroupText, Row, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import { auth } from "../../../firebaseConfig";

const WatchList = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState("");
    const [stocksData, setStocksData] = useState([]);
    const [cryptoData, setCryptoData] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [filteredCrypto, setFilteredCrypto] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserData(user);
                fetchData(user);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const filterData = () => {
            const query = searchQuery.toLowerCase();
            const filterStocks = stocksData.filter(element => {
                const tickerMatch = element?.tickerDetails?.results?.ticker.toLowerCase().includes(query);
                const companyMatch = element?.tickerDetails?.results?.name.toLowerCase().includes(query);
                return tickerMatch || companyMatch;
            });

            const filterCrypto = cryptoData.filter(element => {
                const tickerMatch = element?.tickerDetails?.results?.ticker.toLowerCase().includes(query);
                const companyMatch = element?.tickerDetails?.results?.name.toLowerCase().includes(query);
                return tickerMatch || companyMatch;
            });

            setFilteredStocks(filterStocks);
            setFilteredCrypto(filterCrypto);
        };

        filterData();
    }, [searchQuery, stocksData, cryptoData]);

    const fetchData = async (user) => {
        try {
            const tickers = [];
            const stocks = [];
            const crypto = [];

            const watchListData = await getAllWatchListData(user.uid);

            watchListData.forEach(element => {
                tickers.push(element?.ticker);
            });

            const realTimeData = await getRealTimeData(tickers);

            realTimeData.forEach(element => {
                if (element?.tickerDetails?.results?.market == "stocks") {
                    stocks.push(element);
                }
                else if (element?.tickerDetails?.results?.market == "crypto") {
                    crypto.push(element);
                }
            });

            setStocksData(stocks);
            setFilteredStocks(stocks);
            setCryptoData(crypto);
            setFilteredCrypto(crypto);
        } catch (error) {
            Swal.fire({
                title: "Failed to fetch data",
                text: error.message,
                icon: "error"
            });
        }
        setLoading(false);
    };

    const removeFromWatchList = async (ticker) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setBtnLoading(ticker);
                    await removeTickerFromWatchList(ticker, userData?.uid);

                    Swal.fire({
                        title: "Removed!",
                        text: "Your ticker has been removed from watchlist.",
                        icon: "success"
                    });

                    setLoading(true);
                    await fetchData(userData);

                } catch (error) {
                    // console.log("Error -->", error);
                    Swal.fire({
                        title: "Failed to remove ticker",
                        text: error.message,
                        icon: "error"
                    });
                }
                setBtnLoading("");
            }
        });

    }

    const goToStocksDetails = (ticker) => {
        const route = `ticker/${ticker}`;
        router.push(route);
    }

    return (
        <DashboardLayout>
            <div className='main-layout-container container-fluid h-100 py-3'>
                <div className="card px-4 components-main-card main-card-with-table">
                    <Card className="py-0 no-border-card">
                        <h5 className='news-details-title'>Watchlist</h5>
                        <Row>
                            <Col lg={4} md={6} sm={12}>
                                <InputGroup className='mb-3'>
                                    <InputGroupText style={{ background: "white" }} className='search-inside-component-icon'>
                                        <Image src="/assets/svg/Search.svg" alt="Search" width={18} height={18} priority />
                                    </InputGroupText>
                                    <Input placeholder="Search"
                                        className='search-inside-component'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="table-responsive">
                            <table className="table api-listing-table">
                                <thead className='api-listing-table-head'>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Stocks</th>
                                        <th scope="col">Company Name</th>
                                        <th scope="col">Industry</th>
                                        <th scope="col" className='table-column-right'>24 Hours</th>
                                        <th scope="col" className='table-column-right'>Total Market Cap</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                <Spinner
                                                    className='spinner-color-orange my-4 text-center'
                                                    animation="border"
                                                    role="status"
                                                    style={{ width: '2.5rem', height: '2.5rem' }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {filteredStocks?.length > 0 ?
                                            (filteredStocks.map((stock, index) => {
                                                return (
                                                    <tr className='api-listing-table-data-row'
                                                        key={index}
                                                    >
                                                        <th scope="row"
                                                            onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)}>
                                                            {index + 1}
                                                        </th>
                                                        <td onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)}>
                                                            {stock?.tickerDetails?.results?.ticker}
                                                        </td>

                                                        <td className="company-name"
                                                            title={stock?.tickerDetails?.results?.name}
                                                            data-full-name={stock?.tickerDetails?.results?.name}
                                                            onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)}
                                                        >
                                                            {stock?.tickerDetails?.results?.name}
                                                        </td>

                                                        <td className="company-name"
                                                            title={stock?.tickerDetails?.results?.sic_description}
                                                            data-full-name={stock?.tickerDetails?.results?.sic_description}
                                                            onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)}
                                                        >
                                                            {stock?.tickerDetails?.results?.sic_description ?? " -- "}
                                                        </td>

                                                        <td onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {millionBillionNotation(stock?.prevDayAgg?.results[0]?.v) ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {millionBillionNotation(stock?.tickerDetails?.results?.market_cap) ?? " -- "}
                                                        </td>
                                                        <td>
                                                            <button className='btn none-outline-button remove-from-watchList'
                                                                type='button'
                                                                onClick={() => removeFromWatchList(stock?.tickerDetails?.results?.ticker)}
                                                            >
                                                                {btnLoading == stock?.tickerDetails?.results?.ticker ?
                                                                    <Spinner className='spinner-color-orange'
                                                                        animation="border"
                                                                        role="status"
                                                                        style={{ width: '1.5rem', height: '1.5rem' }}
                                                                    />
                                                                    :
                                                                    "remove"
                                                                }
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center">No matching stocks found.</td>
                                                </tr>
                                            )}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="table-responsive">
                            <table className="table api-listing-table">
                                <thead className='api-listing-table-head'>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Crypto</th>
                                        <th scope="col" className='table-column-right'>Price</th>
                                        <th scope="col" className='table-column-right'>1h</th>
                                        <th scope="col" className='table-column-right'>24h</th>
                                        <th scope="col" className='table-column-right'>7d</th>
                                        <th scope="col" className='table-column-right'>Market Cap</th>
                                        <th scope="col" className='table-column-right'>Volume (24h)</th>
                                        <th scope="col" className='table-column-right'>Circulating</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="10" className="text-center">
                                                <Spinner
                                                    className='spinner-color-orange my-4 text-center'
                                                    animation="border"
                                                    role="status"
                                                    style={{ width: '2.5rem', height: '2.5rem' }}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                ) : (
                                    <tbody>
                                        {filteredCrypto?.length > 0 ?
                                            (filteredCrypto.map((crypto, rowIndex) => {
                                                return (
                                                    <tr className='api-listing-table-data-row'
                                                        key={rowIndex}
                                                    >
                                                        <th scope="row"
                                                            onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)}>
                                                            {rowIndex + 1}
                                                        </th>
                                                        <td className="company-name"
                                                            title={crypto?.tickerDetails?.results?.name}
                                                            data-full-name={crypto?.tickerDetails?.results?.name}
                                                            onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)}
                                                        >
                                                            {crypto?.tickerDetails?.results?.name}
                                                        </td>

                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {crypto?.results?.price ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {crypto?.results?.volume1h ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {crypto?.results?.volume7d ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {crypto?.prevDayAgg?.results[0]?.c ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {millionBillionNotation(crypto?.results?.market_cap) ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {millionBillionNotation(crypto?.prevDayAgg?.results[0]?.v) ?? " -- "}
                                                        </td>
                                                        <td onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)} className='table-column-right'>
                                                            {crypto?.results?.share_class_shares_outstanding ?? " -- "}
                                                        </td>
                                                        <td>
                                                            <button className='btn none-outline-button remove-from-watchList'
                                                                type='button'
                                                                onClick={() => removeFromWatchList(crypto?.tickerDetails?.results?.ticker)}
                                                            >
                                                                {btnLoading == crypto?.tickerDetails?.results?.ticker ?
                                                                    <Spinner
                                                                        className='spinner-color-orange'
                                                                        animation="border"
                                                                        role="status"
                                                                        style={{ width: '1.5rem', height: '1.5rem' }}
                                                                    />
                                                                    :
                                                                    "remove"
                                                                }
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })) : (
                                                <tr>
                                                    <td colSpan="10" className="text-center">No matching crypto found.</td>
                                                </tr>
                                            )}
                                    </tbody>
                                )}
                            </table>
                        </div>
                    </Card>
                </div>
            </div >
        </DashboardLayout>
    )
}

export default WatchList;
