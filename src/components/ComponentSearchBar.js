import useDebounce from '@/utils/useDebounce';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { Input, InputGroup, InputGroupText, Spinner } from 'reactstrap';

const ComponentSearchBar = ({ goToStocksDetails, data, placeholder }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    useEffect(() => {
        const filterData = () => {
            const query = debouncedSearchQuery.toLowerCase();
            const filtered = data.filter(item => {
                const tickerMatch = item?.ticker?.toLowerCase().includes(query);
                const companyMatch = item?.name?.toLowerCase().includes(query);
                return tickerMatch || companyMatch;
            });
            setFilteredData(filtered);
            setLoading(false);
        };

        if (debouncedSearchQuery) {
            setLoading(true);
            filterData();
        } else {
            setFilteredData([]);
            setLoading(false);
        }
    }, [debouncedSearchQuery, data]);

    return (
        <>
            <InputGroup className='mb-3'>
                <InputGroupText style={{ background: "white" }} className='search-inside-component-icon'>
                    <Image src="/assets/svg/Search.svg" alt="Search" width={18} height={18} priority />
                </InputGroupText>
                <Input
                    placeholder={`Search ${placeholder}`}
                    className='search-inside-component'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>
            <div className={`searchResultsModal searchResultModalHomePage ${searchQuery !== '' ? 'd-flex' : 'd-none'}`}>
                {loading ? (
                    <div className='d-flex justify-content-center'>
                        <Spinner
                            className='spinner-color-orange my-4 text-center'
                            animation="border"
                            role="status"
                            style={{ width: '2.5rem', height: '2.5rem' }}
                        />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover api-listing-table table-md">
                            <thead className='api-listing-table-head'>
                                <tr>
                                    <th scope="col">Symbol</th>
                                    <th scope="col">Company Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index}
                                            className='api-listing-table-data-row'
                                            onClick={() => goToStocksDetails(item?.ticker)}
                                        >
                                            <td>{item?.ticker ?? " -- "}</td>
                                            <td className="company-name"
                                                title={item?.name}
                                                data-full-name={item?.name}
                                            >
                                                {item?.name ?? " -- "}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">No matching record found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default ComponentSearchBar;