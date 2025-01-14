'use client'
import { fetchAllCrypto } from '@/api/crypto';
import ComponentSearchBar from '@/components/ComponentSearchBar';
import CustomPagination from '@/components/CustomPagination';
import AppLayout from '@/components/mainLayouts/AppLayout';
import { millionBillionNotation } from '@/utils/CommonFunctions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, Col, Input, InputGroup, InputGroupText, Row, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import tickerDetails from "../../helpers/ticker-detail.json";
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';

const AllCrypto = () => {
    const router = useRouter();
    const pageSize = 20;
    const [loading, setLoading] = useState(false);
    const [crypto, setCrypto] = useState([]);
    const [filteredCrypto, setFilteredCrypto] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalCrypto, setTotalCrypto] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchBarData, setSearchBarData] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState({
        symbol: true,
        companyName: true,
        price: true,
        oneHour: true,
        twentyFourHours: true,
        sevenDays: true,
        marketCap: true,
        volume: true,
        circulatingSupply: true,
    });

    useEffect(() => {
        fetchData();

        const crypto = tickerDetails?.crypto;
        setSearchBarData(crypto);

        const savedFilters = JSON.parse(localStorage.getItem('CryptoFilteredColumns'));
        if (savedFilters) {
            setVisibleColumns(savedFilters);
        }
    }, []);

    useEffect(() => {
        const filterCrypto = () => {
            const filtered = crypto?.filter(crypto => {
                const tickerMatch = crypto?.tickerDetails?.results?.ticker.toLowerCase().includes(searchQuery.toLowerCase());
                const companyMatch = crypto?.tickerDetails?.results?.name.toLowerCase().includes(searchQuery.toLowerCase());
                return tickerMatch || companyMatch;
            });
            setFilteredCrypto(filtered);
        }
        filterCrypto();
    }, [searchQuery, crypto]);

    const fetchData = async (page) => {
        try {
            setLoading(true);

            const pageNumber = page ? page : currentPage;
            const { cryptoData, totalCryptoCount } = await fetchAllCrypto(pageNumber, pageSize);

            setTotalCrypto(totalCryptoCount);
            setCrypto(cryptoData);
            setFilteredCrypto(cryptoData);

            setLoading(false);
        } catch (error) {
            setLoading(false);

            Swal.fire({
                icon: "error",
                title: "Oops, An Error Occurred",
                text: error.message,
            });
            console.error('Error fetching data:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        localStorage.setItem("currentPage", page);
        setLoading(true);
        fetchData(page);
    };

    const handleColumnToggle = (column) => {
        const updatedColumns = {
            ...visibleColumns,
            [column]: !visibleColumns[column],
        };
        setVisibleColumns(updatedColumns);
        localStorage.setItem('CryptoFilteredColumns', JSON.stringify(updatedColumns));
    };

    const goToStocksDetails = (ticker) => {
        const route = `ticker/${ticker}`;
        router.push(route);
    }

    const startIndex = (currentPage - 1) * pageSize + 1;

    return (
        <AppLayout>
            <div className='main-layout-container container-fluid h-100 py-3'>
                <div className="card px-4 components-main-card main-card-with-table">
                    <Card className="py-0 no-border-card">
                        <h5 className='news-details-title'>All Cryptocurrencies ({totalCrypto})</h5>
                        <Row className='justify-content-between'>
                            <Col lg={4} md={6} sm={12}>
                                <ComponentSearchBar
                                    goToStocksDetails={goToStocksDetails}
                                    data={searchBarData}
                                    placeholder={"Crypto"}
                                />
                            </Col>
                            <Col lg={4} md={6} sm={12} className="d-flex justify-content-end">
                                <DropdownButton id="dropdown-basic-button" title="Filter Columns" className='table-filter-dropdown'>
                                    <Form.Check
                                        type="checkbox"
                                        id="symbol"
                                        label="Symbol"
                                        checked={visibleColumns.symbol}
                                        onChange={() => handleColumnToggle('symbol')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="companyName"
                                        label="Company Name"
                                        checked={visibleColumns.companyName}
                                        onChange={() => handleColumnToggle('companyName')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="price"
                                        label="Price"
                                        checked={visibleColumns.price}
                                        onChange={() => handleColumnToggle('price')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="oneHour"
                                        label="1h"
                                        checked={visibleColumns.oneHour}
                                        onChange={() => handleColumnToggle('oneHour')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="twentyFourHours"
                                        label="24h"
                                        checked={visibleColumns.twentyFourHours}
                                        onChange={() => handleColumnToggle('twentyFourHours')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="sevenDays"
                                        label="7d"
                                        checked={visibleColumns.sevenDays}
                                        onChange={() => handleColumnToggle('sevenDays')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="marketCap"
                                        label="Market Cap"
                                        checked={visibleColumns.marketCap}
                                        onChange={() => handleColumnToggle('marketCap')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="volume"
                                        label="Volume (24hr)"
                                        checked={visibleColumns.volume}
                                        onChange={() => handleColumnToggle('volume')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="circulatingSupply"
                                        label="Circulating Supply"
                                        checked={visibleColumns.circulatingSupply}
                                        onChange={() => handleColumnToggle('circulatingSupply')}
                                    />
                                </DropdownButton>
                            </Col>
                        </Row>
                        <div className="table-responsive">
                            <table className="table table-hover api-listing-table table-md">
                                <thead className='api-listing-table-head'>
                                    <tr>
                                        <th scope="col"></th>
                                        {visibleColumns.symbol && <th scope="col">Symbol</th>}
                                        {visibleColumns.companyName && <th scope="col">Company Name</th>}
                                        {visibleColumns.price && <th scope="col" className='table-column-right'>Price</th>}
                                        {visibleColumns.oneHour && <th scope="col" className='table-column-right'>1h</th>}
                                        {visibleColumns.twentyFourHours && <th scope="col" className='table-column-right'>24h</th>}
                                        {visibleColumns.sevenDays && <th scope="col" className='table-column-right'>7d</th>}
                                        {visibleColumns.marketCap && <th scope="col" className='table-column-right'>Market Cap</th>}
                                        {visibleColumns.volume && <th scope="col" className='table-column-right'>Volume (24hr)</th>}
                                        {visibleColumns.circulatingSupply && <th scope="col">Circulating Supply</th>}
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
                                        {filteredCrypto?.length > 0 ? (
                                            filteredCrypto?.map((crypto, index) => (
                                                <tr key={index} className='api-listing-table-data-row' onClick={() => goToStocksDetails(crypto?.tickerDetails?.results?.ticker)}>
                                                    <th scope="row">{startIndex + index}</th>
                                                    {visibleColumns.symbol && <td>{crypto?.tickerDetails?.results?.ticker}</td>}
                                                    {visibleColumns.companyName && (
                                                        <td className="company-name"
                                                            title={crypto?.tickerDetails?.results?.name}
                                                            data-full-name={crypto?.tickerDetails?.results?.name}>
                                                            {crypto?.tickerDetails?.results?.name}
                                                        </td>
                                                    )}
                                                    {visibleColumns.price && <td className='table-column-right'> -- </td>}
                                                    {visibleColumns.oneHour && <td className='table-column-right'> -- </td>}
                                                    {visibleColumns.twentyFourHours && <td className='table-column-right'>{crypto?.prevDayAgg?.results[0]?.c}</td>}
                                                    {visibleColumns.sevenDays && <td className='table-column-right'> -- </td>}
                                                    {visibleColumns.marketCap && <td className='table-column-right'> -- </td>}
                                                    {visibleColumns.volume && <td className='table-column-right'>
                                                        {millionBillionNotation(crypto?.prevDayAgg?.results[0]?.v)}
                                                    </td>}
                                                    {visibleColumns.circulatingSupply && <td> -- </td>}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">No matching currency found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="custom-pagination-wrapper">
                            <CustomPagination
                                totalStocks={totalCrypto}
                                itemsPerPage={pageSize}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Card>
                </div>
            </div >
        </AppLayout>
    )
}

export default AllCrypto
