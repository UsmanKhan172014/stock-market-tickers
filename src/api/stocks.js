import axios from 'axios';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
// import tickerDetails from "../helpers/ticker-detail.json";
import tickerDetails from "@/helpers/ticker-detail.json";

// Your Polygon.io API key
const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const baseUrl = 'https://api.polygon.io/v3/reference/tickers';

export async function fetchAllStocks(page, pageSize = 20) {
    try {
        const stocks = tickerDetails.stocks;
        const totalStocksCount = stocks?.length;

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedStocks = stocks.slice(startIndex, endIndex);

        const tickers = paginatedStocks?.map(stock => stock?.ticker);

        const promises = tickers.map(async (ticker) => {
            const tickerDetailsUrl = `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${API_KEY}`;
            const prevDayAggUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${API_KEY}`;

            return await Promise.all([
                axios.get(tickerDetailsUrl),
                axios.get(prevDayAggUrl)
            ]).then(([tickerDetailsResponse, prevDayAggResponse]) => {
                return {
                    tickerDetails: tickerDetailsResponse.data,
                    prevDayAgg: prevDayAggResponse.data
                };
            });
        });

        const stocksData = await Promise.all(promises);
        return { stocksData, totalStocksCount };

    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks');
    }
}

export async function fetchPaginatedStocks(nextUrl) {
    try {
        const params = {
            apiKey: API_KEY
        };

        const response = await axios.get(nextUrl, { params });
        const stocksList = response.data;

        const tickers = stocksList?.results?.map(stock => stock?.ticker);

        const promises = tickers.map(ticker => {
            const tickerDetailsUrl = `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${API_KEY}`;
            return new Promise((resolve, reject) => {
                axios.get(tickerDetailsUrl)
                    .then(tickerDetailsResponse => {
                        const tickerDetails = tickerDetailsResponse.data;
                        resolve(tickerDetails);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        });

        const stocks = await Promise.all(promises);
        return stocks;

    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks');
    }
}

export async function fetchSpecificTicker(ticker) {
    try {
        const endpoints = {
            tickerInfo: `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${API_KEY}`,
            dividends: `https://api.polygon.io/v3/reference/dividends?ticker=${ticker}&limit=1&apiKey=${API_KEY}`,
            financials: `https://api.polygon.io/vX/reference/financials?ticker=${ticker}&limit=1&apiKey=${API_KEY}`
        };

        const fetchPromises = Object.entries(endpoints).map(([key, endpoint]) =>
            fetch(endpoint)
                .then(response => response.json())
                .then(data => ({ [key]: data }))
        );

        const resultsArray = await Promise.all(fetchPromises);

        const results = resultsArray.reduce((acc, result) => {
            return { ...acc, ...result };
        }, {});

        return results;

    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks');
    }
}

export async function fetchTickerGraphData(ticker, startDate, endDate) {
    const params = {
        adjusted: true,
        sort: "asc",
        apiKey: API_KEY
    }
    const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/5/minute/${startDate}/${endDate}`,
        { params }
    );
    const data = response;
    return data;
}

export async function storeAllStocksData() {
    try {
        const db = getFirestore();

        const completeData = await fetchAllStocks();

        const newCollectionRef = collection(db, 'DataForSearch');
        const collectionSnapshot = await getDocs(newCollectionRef);

        if (collectionSnapshot.empty) {
            await Promise.all(completeData.map(async (data) => {
                await addDoc(newCollectionRef, data);
            }));

            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('Error fetching stocks:', error);
        return false; // Return false to indicate failure
    }
}

export async function stockFinances(ticker) {
    try {
        const response = await axios.get(
            `https://api.polygon.io/vX/reference/financials?ticker=${ticker}&limit=1&apiKey=${API_KEY}`,
        );
        const data = response;
        return data;
    } catch (error) {
        // console.log("Stock Finances Error: ", error);
        return error;
    }
}