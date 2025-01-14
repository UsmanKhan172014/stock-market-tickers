import axios from 'axios';

// Your Alphavantage.co API key
const API_KEY = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;

export async function fetchCompanyProfile(ticker) {
    try {
        // var url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${API_KEY}`;
        var url = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=yj7fYEXUx7Cc2EblSNmb3A77dV3tkzCm`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'request' }
        });
        return response.data;

    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks');
    }
}