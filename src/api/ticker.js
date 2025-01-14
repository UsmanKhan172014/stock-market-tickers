
import axios from 'axios';
import { formattedDataToday, formattedDate52WeeksAgo, formattedDateYesterday } from '@/utils/CommonFunctions';

// Your Polygon.io API key
const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

export async function fetchTickerTradesData(ticker) {
    try {
        const date = formattedDataToday();
        const date52WeeksAgo = formattedDate52WeeksAgo();

        const openCloseUrl = `https://api.polygon.io/v1/open-close/${ticker}/${date}?adjusted=true&apiKey=${API_KEY}`;
        const lastTradeUrl = `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${API_KEY}`;
        const lastQuoteUrl = `https://api.polygon.io/v2/last/nbbo/${ticker}?apiKey=${API_KEY}`;
        const highLow52WeekUrl = `https://api.polygon.io/v1/open-close/${ticker}/${date52WeeksAgo}?adjusted=true&apiKey=${API_KEY}`;
        const previousCloseUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${API_KEY}`;

        const [openCloseResponse, lastTradeResponse, lastQuoteResponse, highLow52WeekResponse, previousCloseResponse] = await Promise.all([
            fetch(openCloseUrl),
            fetch(lastTradeUrl),
            fetch(lastQuoteUrl),
            fetch(highLow52WeekUrl),
            fetch(previousCloseUrl)
        ]);

        const openCloseData = await openCloseResponse.json();
        const lastTradeData = await lastTradeResponse.json();
        const lastQuoteData = await lastQuoteResponse.json();
        const highLow52WeekData = await highLow52WeekResponse.json();
        const previousCloseData = await previousCloseResponse.json();

        return {
            openClose: openCloseData,
            lastTrade: lastTradeData,
            lastQuote: lastQuoteData,
            highLow52Week: highLow52WeekData,
            previousClose: previousCloseData
        };
    } catch (error) {
        console.error('Error fetching ticker trades data:', error);
        return error;
    }
}

export async function fetchFullDayTrades(ticker) {
    try {
        const date = formattedDataToday();

        const initialUrl = `https://api.polygon.io/v3/trades/${ticker}?timestamp=${date}&limit=50000&apiKey=${API_KEY}`;

        const initialResponse = await axios.get(initialUrl);

        const initialData = initialResponse?.data;

        let combinedResults = [...initialData.results];

        if (initialResponse?.data?.next_url) {
            const params = {
                apiKey: API_KEY
            };

            const nextResponse = await axios.get(initialData.next_url, { params });
            const nextData = nextResponse.data;

            combinedResults = [...combinedResults, ...nextData.results];
        }

        return combinedResults;

    } catch (error) {
        console.error('Error fetching trades:', error);
        throw new Error('Failed to fetch trades');
    }
}