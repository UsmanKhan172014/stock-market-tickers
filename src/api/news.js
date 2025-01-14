import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
const baseUrl = 'https://api.polygon.io/v2/reference/news';

export async function fetchAllNews() {
    try {
        const params = {
            limit: 16,
            apiKey: API_KEY
        };

        const response = await axios.get(baseUrl, { params });
        const news = response.data;
        return news;

    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news');
    }
}

export async function fetchPaginatedNews(nextUrl) {
    try {
        const params = {
            apiKey: API_KEY
        };

        const response = await axios.get(nextUrl, { params });
        const news = response.data;
        return news;

    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news');
    }
}

export async function fetchSpecificTicker(ticker) {
    try {
        const params = {
            apiKey: API_KEY
        };

        const response = await axios.get(baseUrl + "/" + ticker, { params });
        const stock = response.data;

        return stock;

    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks');
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

export async function fetchLimitedNews() {
    try {
        const params = {
            published_utc: "2024-07-11",
            limit: 5,
            apiKey: API_KEY,
        };

        const response = await axios.get(baseUrl, { params });
        const news = response.data;
        return news;

    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news');
    }
}