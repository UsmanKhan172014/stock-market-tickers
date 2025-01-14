'use client'
import { useEffect, useState } from "react";

const TradingSightsStatic = ({ barHeading }) => {
    const [stocksResults, setStocksResults] = useState([]);
    const [cryptoResults, setCryptoResults] = useState([]);

    const gainersEndpoint = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
    const losersEndpoint = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;

    const gainersEndpointCrypto = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/gainers?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;
    const losersEndpointCrypto = `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/losers?apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`;

    useEffect(() => {
        async function fetchData(endpoint) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    return data.tickers;
                } else {
                    throw new Error(`Failed to fetch data from ${endpoint}`);
                }
            } catch (error) {
                console.error(error);
                return [];
            }
        }

        Promise.all([fetchData(gainersEndpoint), fetchData(losersEndpoint)])
            .then(([gainersData, losersData]) => {

                const mergedData = [...gainersData, ...losersData];

                const filteredData = mergedData.filter(item => item?.day?.c !== null);

                const shuffledData = filteredData.sort(() => Math.random() - 0.5);

                const top20Random = shuffledData.slice(0, 20);

                setStocksResults(top20Random);
            })
            .catch(error => console.error(error));

    }, []);

    useEffect(() => {
        async function fetchCryptoData(endpoint) {
            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    return data.tickers;
                } else {
                    throw new Error(`Failed to fetch data from ${endpoint}`);
                }
            } catch (error) {
                console.error(error);
                return [];
            }
        }

        Promise.all([fetchCryptoData(gainersEndpointCrypto), fetchCryptoData(losersEndpointCrypto)])
            .then(([gainersDataCrypto, losersDataCrypto]) => {

                const mergedData = [...gainersDataCrypto, ...losersDataCrypto];

                const filteredData = mergedData.filter(item => item?.day?.c !== null);

                const shuffledData = filteredData.sort(() => Math.random() - 0.5);

                const top20Random = shuffledData.slice(0, 20);

                setCryptoResults(top20Random);
            })
            .catch(error => console.error(error));

    }, []);
    return (
        <div
            className={`d-flex tradingSightsStatic ${barHeading == "Stocks" ? "tradingSightStocks" : "tradingSightCrypto"}`}>
            <div className={`px-3 h-100 ${barHeading == "Stocks" ? "tradingSightsBarHeading-stocks" : "tradingSightsBarHeading-crypto"}`}>
                <h5 className='tradingSights-heading'>{barHeading}</h5>
            </div>
            {barHeading == "Stocks" ? (
                <div className="tradingSightsScroll marquee-container">
                    {
                        stocksResults.map((item, index) => (
                            <div className="d-flex mx-2" key={index}>
                                <span className='topCompanies-insights-name'>{item?.ticker}: ${item?.day?.c}</span>
                                {
                                    item?.todaysChangePerc > 0 ? (
                                        <span className='topCompanies-sharesValues-gain ms-2'>
                                            {item?.todaysChangePerc.toFixed(2)}%
                                        </span>
                                    ) : (
                                        <span className='topCompanies-sharesValues-loss ms-2'>
                                            {item?.todaysChangePerc.toFixed(2)}%
                                        </span>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            ) : (
                <div className="tradingSightsScroll marquee-container">
                    {
                        cryptoResults.map((item, index) => (
                            <div className="d-flex mx-2" key={index}>
                                <span className='topCompanies-insights-name'>{item?.ticker}: ${item?.day?.c}</span>
                                {
                                    item?.todaysChangePerc > 0 ? (
                                        <span className='topCompanies-sharesValues-gain ms-2'>
                                            {item?.todaysChangePerc.toFixed(2)}%
                                        </span>
                                    ) : (
                                        <span className='topCompanies-sharesValues-loss ms-2'>
                                            {item?.todaysChangePerc.toFixed(2)}%
                                        </span>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default TradingSightsStatic