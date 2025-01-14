
import axios from 'axios';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';

const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

export async function getAllWatchListData(userId) {
    try {
        const db = getFirestore();
        const watchListCollection = collection(db, 'watchList');

        const q = query(watchListCollection, where('userID', '==', userId));

        const querySnapshot = await getDocs(q);

        const watchListData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return watchListData;
    } catch (error) {
        console.error('Error retrieving watchlist data:', error);
    }
}

export async function addToWatchListHandler(data) {
    try {
        const db = getFirestore();
        const watchListCollection = collection(db, 'watchList');

        if (data && data?.ticker && data?.market) {
            const q = query(watchListCollection, where('data.ticker', '==', data.ticker), where('market', '==', data.market));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                return {
                    status: 'false',
                    message: 'Ticker is already present in WatchList.'
                };
            } else {
                const response = await addDoc(watchListCollection, data);
                return response;
            }
        } else {
            return {
                status: 'false',
                message: 'Invalid data format or missing data.'
            };
        }
    } catch (error) {
        console.error('Error adding to the watchList:', error);
        throw new Error('Failed to add to watchlist');
    }
}

export async function checkIfTickerExists(ticker) {
    try {
        const db = getFirestore();
        const watchListCollection = collection(db, 'watchList');

        const q = query(watchListCollection, where('data.ticker', '==', ticker));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if ticker exists:', error);
    }
}

export async function removeTickerFromWatchList(ticker, userId) {
    try {
        const db = getFirestore();

        const watchListRef = collection(db, 'watchList');

        const q = query(watchListRef, where('userID', '==', userId), where('ticker', '==', ticker));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await deleteDoc(docRef);
            return true;
        } else {
            throw new Error('Ticker not found in watchlist');
        }
    } catch (error) {
        return error;
    }
}

export async function getRealTimeData(tickers) {

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

    const tickersData = await Promise.all(promises);
    return tickersData;
}