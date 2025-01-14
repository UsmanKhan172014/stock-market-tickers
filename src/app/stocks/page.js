'use client'
import { fetchAllStocks } from '@/api/stocks';
import ComponentSearchBar from '@/components/ComponentSearchBar';
import CustomPagination from '@/components/CustomPagination';
import AppLayout from '@/components/mainLayouts/AppLayout';
import { millionBillionNotation } from '@/utils/CommonFunctions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, Col, Input, InputGroup, InputGroupText, Row, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import tickerDetails from "../../helpers/ticker-detail.json";
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';

const AllStocks = () => {
    const router = useRouter();
    const pageSize = 20;
    const [loading, setLoading] = useState(true);
    const [totalStocks, setTotalStocks] = useState(0);
    const [stocks, setStocks] = useState([]);
    const [filteredStocks, setFilteredStocks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchBarData, setSearchBarData] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState({
        symbol: true,
        companyName: true,
        industry: true,
        twentyFourHours: true,
        totalMarketCap: true,
    });

    useEffect(() => {
        fetchData();

        const stocks = tickerDetails?.stocks;
        setSearchBarData(stocks);

        const savedFilters = JSON.parse(localStorage.getItem('StocksFilteredColumns'));
        if (savedFilters) {
            setVisibleColumns(savedFilters);
        }
    }, []);

    const fetchData = async (page) => {
        try {
            const pageNumber = page ? page : currentPage;
            const { stocksData, totalStocksCount } = await fetchAllStocks(pageNumber, pageSize);

            setTotalStocks(totalStocksCount);
            setStocks(stocksData);
            setFilteredStocks(stocksData);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "oops, An Error Occurred",
                text: error.message,
            });
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    }

    const goToStocksDetails = (ticker) => {
        const route = `ticker/${ticker}`;
        router.push(route);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
        localStorage.setItem("currentPage", page);
        setLoading(true);
        fetchData(page);
    };


    const ucfirst = (string)=> {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }


    const handleColumnToggle = (column) => {
        const updatedColumns = {
            ...visibleColumns,
            [column]: !visibleColumns[column],
        };
        setVisibleColumns(updatedColumns);
        localStorage.setItem('StocksFilteredColumns', JSON.stringify(updatedColumns));
    };

    const startIndex = (currentPage - 1) * pageSize + 1;

    return (
        <AppLayout>
            <div className='main-layout-container container-fluid h-100 py-3'>
                <div className="card components-main-card main-card-with-table">
                    <Card className="py-0 no-border-card">
                        <h5 className='news-details-title'>All Stocks ({totalStocks})</h5>
                        <Row className='justify-content-between'>
                            <Col lg={4} md={6} sm={12}>
                                <ComponentSearchBar
                                    goToStocksDetails={goToStocksDetails}
                                    data={searchBarData}
                                    placeholder={"Stocks"}
                                />
                            </Col>
                            <Col lg={4} md={6} sm={12} className="d-flex justify-content-end">
                                <DropdownButton id="dropdown-basic-button" title="Select Columns" className='table-filter-dropdown'>
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
                                        id="industry"
                                        label="Industry"
                                        checked={visibleColumns.industry}
                                        onChange={() => handleColumnToggle('industry')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="twentyFourHours"
                                        label="24 Hours"
                                        checked={visibleColumns.twentyFourHours}
                                        onChange={() => handleColumnToggle('twentyFourHours')}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        id="totalMarketCap"
                                        label="Total Market Cap"
                                        checked={visibleColumns.totalMarketCap}
                                        onChange={() => handleColumnToggle('totalMarketCap')}
                                    />
                                </DropdownButton>
                            </Col>
                        </Row>
                        <div className="table-responsive">
                            <table className="table table-hover api-listing-table table-md">
                                <thead className='api-listing-table-head'>
                                    <tr>
                                        <th scope="col"></th>
                                        {visibleColumns.symbol && <th scope="col" >Symbol</th>}
                                        {visibleColumns.companyName && <th scope="col">Company Name</th>}
                                        {visibleColumns.industry && <th scope="col">Industry</th>}
                                        {visibleColumns.twentyFourHours && <th scope="col" className='table-column-right'>24 Hours</th>}
                                        {visibleColumns.totalMarketCap && <th scope="col">Total Market Cap</th>}
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
                                        {filteredStocks.length > 0 ? (
                                            filteredStocks.map((stock, index) => (
                                                <tr key={index} className='api-listing-table-data-row' onClick={() => goToStocksDetails(stock?.tickerDetails?.results?.ticker)}>
                                                    <th scope="row">{startIndex + index}</th>
                                                    {visibleColumns.symbol && <td>{stock?.tickerDetails?.results?.ticker ?? " -- "}</td>}
                                                    {visibleColumns.companyName && (
                                                        <td className="company-name"
                                                            title={stock?.tickerDetails?.results?.name}
                                                            data-full-name={stock?.tickerDetails?.results?.name}>
                                                            {stock?.tickerDetails?.results?.name ?? " -- "}
                                                        </td>
                                                    )}
                                                    {visibleColumns.industry && (
                                                        <td className="company-name"
                                                            title={stock?.tickerDetails?.results?.sic_description}
                                                            data-full-name={stock?.tickerDetails?.results?.sic_description}>
                                                            {ucfirst(stock?.tickerDetails?.results?.sic_description) ?? " -- "}
                                                        </td>
                                                    )}
                                                    {visibleColumns.twentyFourHours && (
                                                        <td className='table-column-right'>
                                                            {stock?.prevDayAgg?.results ? millionBillionNotation(stock?.prevDayAgg?.results[0]?.v) : " -- "}
                                                        </td>
                                                    )}
                                                    {visibleColumns.totalMarketCap && (
                                                        <td>
                                                            {millionBillionNotation(stock?.tickerDetails?.results?.market_cap) ?? " -- "}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">No matching stocks found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="custom-pagination-wrapper">
                            <CustomPagination
                                totalStocks={totalStocks}
                                itemsPerPage={pageSize}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </Card>
                </div>
            </div >
        </AppLayout >
    )
}

export default AllStocks
