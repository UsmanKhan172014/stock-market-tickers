import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { fetchAllStocks } from './stocks';

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
        return false;
    }
}

export async function getStoredData() {
    const db = getFirestore();
    const searchDataCollection = collection(db, 'DataForSearch');

    const querySnapshot = await getDocs(searchDataCollection);

    const searchData = querySnapshot.docs.map(doc => doc.data());

    return searchData;
}