import axios from 'axios';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import tickerDetails from "../helpers/ticker-detail.json";

// Your Polygon.io API key
const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const baseUrl = 'https://api.polygon.io/v3/reference/tickers';

export async function fetchAllCrypto(page = 1, pageSize = 20) {
    try {
        const crypto = tickerDetails.crypto;
        const totalCryptoCount = crypto?.length;

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedCrypto = crypto.slice(startIndex, endIndex);

        const tickers = paginatedCrypto?.map(crypto => crypto?.ticker);

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

        const cryptoData = await Promise.all(promises);
        return { cryptoData, totalCryptoCount };

    } catch (error) {
        console.error('Error fetching crypto:', error);
        throw new Error('Failed to fetch crypto');
    }
}

export async function fetchPaginatedCrypto(nextUrl) {
    try {
        const params = {
            apiKey: API_KEY
        };

        const response = await axios.get(nextUrl, { params });
        const crypto = response.data;
        return crypto;

    } catch (error) {
        console.error('Error fetching crypto:', error);
        throw new Error('Failed to fetch crypto');
    }
}

export async function fetchSpecificTicker(ticker) {
    try {
        const params = {
            apiKey: API_KEY
        };

        const response = await axios.get(baseUrl + "/" + ticker, { params });
        const crypto = response.data;

        return crypto;

    } catch (error) {
        console.error('Error fetching crypto:', error);
        throw new Error('Failed to fetch crypto');
    }
}

export async function fetchTickerGraphData(ticker, noOfUnits, unitType, startDate, endDate) {
    const params = {
        adjusted: true,
        sort: "asc",
        apiKey: API_KEY
    }

    const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${noOfUnits}/${unitType}/${startDate}/${endDate}`,
        { params }
    );
    const data = response;
    return data;
}

export async function storeAllCryptoData(cryptoData) {
    try {
        const db = getFirestore();

        const completeData = await fetchAllCrypto();

        const newCollectionRef = collection(db, 'DataForSearch');

        await Promise.all(completeData.map(async (data) => {
            await addDoc(newCollectionRef, data);
        }));

        return true;

    } catch (error) {
        console.error('Error storing stock data:', error);
        return false;
    }
}