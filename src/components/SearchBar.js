import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Form, Input, InputGroup, InputGroupText, Spinner } from 'reactstrap'
import useDebounce from '@/utils/useDebounce';
import tickerDetails from "../helpers/ticker-detail.json";

const SearchBar = ({ parent }) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const debouncedSearchQuery = useDebounce(searchQuery, 1500);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const filterData = () => {
            const query = debouncedSearchQuery.toLowerCase();
            const combinedData = [...tickerDetails?.stocks, ...tickerDetails?.crypto];

            const filtered = combinedData.filter(item => {
                const tickerMatch = item?.ticker?.toLowerCase().includes(query);
                const companyMatch = item?.name?.toLowerCase().includes(query);
                const marketMatch = item?.market?.toLowerCase().includes(query);
                return tickerMatch || companyMatch || marketMatch;
            });

            setFilteredData(filtered);
            setLoading(false);
        };

        if (debouncedSearchQuery) {
            filterData();
        } else {
            setFilteredData([]);
            setLoading(false);
        }
    }, [debouncedSearchQuery, tickerDetails]);

    const goToStocksDetails = (ticker) => {
        const route = `/ticker/${ticker}`;
        router.push(route);
    }

    return (
        <>
            {parent == "navbar" &&
                <Form className='navbar-searchBar'>
                    <InputGroup>
                        <InputGroupText style={{ background: "white" }} className='none-border-field'>
                            <Image src="/assets/svg/Search.svg" alt="Search" width={18} height={18} priority />
                        </InputGroupText>
                        <Input placeholder="Search" className='none-border-field' onChange={(e) => setSearchQuery(e.target.value)} />
                    </InputGroup>
                    <div className={`searchResultsModal searchResultModalNavbar ${searchQuery !== '' ? 'd-flex' : 'd-none'}`}>
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
                            <div className="container-fluid">
                                <div className="table-responsive">
                                    <table className="table table-hover api-listing-table table-md">
                                        <thead className='api-listing-table-head'>
                                            <tr>
                                                <th scope="col">Symbol</th>
                                                <th scope="col">Company Name</th>
                                                <th scope="col">Market</th>
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

                                                        <td> {item?.market ?? " -- "} </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No matching record found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </Form>
            }
            {parent == "homePage" &&
                <>
                    <InputGroup className='mt-3'>
                        <InputGroupText className='homePageSearchBarIcon'>
                            <Image src="/assets/svg/Search.svg" alt="Search" width={18} height={18} priority />
                        </InputGroupText>
                        <Input placeholder="Search"
                            className='homePageSearchBar'
                            onKeyUp={(e) => setSearchQuery(e.target.value)} />
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
                            <div className="container-fluid">
                                <div className="table-responsive">
                                    <table className="table table-hover api-listing-table table-md">
                                        <thead className='api-listing-table-head'>
                                            <tr>
                                                <th scope="col">Symbol</th>
                                                <th scope="col">Company Name</th>
                                                <th scope="col">Market</th>
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

                                                        <td> {item?.market ?? " -- "} </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="text-center">No matching record found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            }
        </>
    )
}

export default SearchBar