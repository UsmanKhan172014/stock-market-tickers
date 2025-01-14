import { stockFinances } from '@/api/stocks';
import { millionBillionNotation } from '@/utils/CommonFunctions';
import React, { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'reactstrap';

const getFinancialSections = (financials) => {
    const sections = {};
    for (const [section, data] of Object.entries(financials)) {
        sections[section] = [];
        for (const [key, value] of Object.entries(data)) {
            sections[section].push({
                name: key.replace(/_/g, ' '),
                ...value
            });
        }
    }
    return sections;
};

const FinancialsTab = ({ ticker }) => {
    const [loading, setLoading] = useState(true);
    const [financialSections, setFinancialSections] = useState({});
    const [dateRange, setDateRange] = useState("");

    useEffect(() => {
        fetchData();
    }, [ticker]);

    const fetchData = async () => {
        try {
            const response = await stockFinances(ticker);

            const range = response?.data?.results[0]?.start_date + " - " + response?.data?.results[0]?.end_date;
            setDateRange(range);

            const financialSections = getFinancialSections(response.data.results[0].financials);
            setFinancialSections(financialSections);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            // console.log("Finances Error", error);
        }
    };

    const renderTable = (title, items) => (
        <div key={title}>
            <h3 className='financial-tab-table-heading'>{title.replace(/_/g, ' ').toUpperCase()}</h3>
            <div className="table-responsive">
                <table className="table table-hover api-listing-table table-md">
                    <thead className='api-listing-table-head'>
                        <tr>
                            <th>Label</th>
                            <th>Value</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.map((item, index) => (
                            <tr key={index}>
                                <td>{item?.label}</td>
                                <td>{millionBillionNotation(item?.value) ?? " --"}</td>
                                <td>{item?.unit ?? " -- "}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

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
                    <Col lg="12" md="12" sm="12" className='mt-3'>
                        {dateRange ?
                            <div className='d-flex justify-content-end'>
                                <span className='font-weight-bold'>Date Range: {dateRange}</span>
                            </div>
                            : null
                        }
                        {Object.entries(financialSections).map(([title, items]) => renderTable(title, items))}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default FinancialsTab;
