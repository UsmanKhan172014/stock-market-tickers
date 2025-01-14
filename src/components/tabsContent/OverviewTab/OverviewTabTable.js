import React, { useEffect, useState } from 'react';
import { formatDate, millionBillionNotation } from '@/utils/CommonFunctions';
import { Spinner } from 'reactstrap';
import { fetchFullDayTrades, fetchTickerTradesData } from '@/api/ticker';

const OverviewTab = ({ ticker, tickerMarket }) => {
    const [openClose, setOpenClose] = useState([]);
    const [lastTrade, setLastTrade] = useState([]);
    const [lastQuote, setLastQuote] = useState([]);
    const [highLow52Week, setHighLow52Week] = useState([]);
    const [previousClose, setPreviousClose] = useState([]);
    const [totalVolume, setTotalVolume] = useState(0);
    const [totalDollarVolume, setTotalDollarVolume] = useState(0);
    const [totalNoOfTrades, setTotalNoOfTrades] = useState(0);
    const [tradeVolume, setTradeVolume] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrades();
        fetchData();
    }, []);

    const fetchData = () => {
        fetchTickerTradesData(ticker)
            .then(data => {

                const openCloseData = data?.openClose;
                const lastQuoteData = data?.lastQuote?.results;
                const lastTradeData = data?.lastTrade?.results;
                const highLow52WeekData = data?.highLow52Week;
                const previousCloseData = data?.previousClose?.results;

                setOpenClose(openCloseData);
                setLastTrade(lastTradeData);
                setLastQuote(lastQuoteData);
                setHighLow52Week(highLow52WeekData);
                setPreviousClose(previousCloseData);
            })
            .catch(error => {
                // console.log("Error loading trades data: ", error);
                Swal.fire({
                    icon: "error",
                    title: "Error fetching today's trades data.",
                    text: "Sorry, Trades Data is not available.",
                });
            });
    }

    const fetchTrades = async () => {
        try {
            const fullTrades = await fetchFullDayTrades(ticker);

            let totalSize = 0;
            let totalPrice = 0;

            fullTrades.forEach(trade => {
                totalSize += trade.size;
                totalPrice += trade.price * trade.size;
            });

            const totalTrades = fullTrades?.length;
            const averagePrice = totalPrice / totalTrades ?? 0;

            setTotalVolume(totalSize);
            setTotalDollarVolume(averagePrice);
            setTotalNoOfTrades(totalTrades);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            // console.log("-> Error getting volume: ", error);
        }
    }

    return (
        <div className={`overview-tab mt-3 ${loading ? "d-flex align-items-center" : ""}`}>
            {loading ? (
                <Spinner
                    className='spinner-color-orange'
                    animation="border"
                    role="status"
                    style={{ width: '2.5rem', height: '2.5rem' }}
                />
            ) : (
                <>
                    <div className={`overview-row ${tickerMarket == "crypto" ? "d-none" : ""}`}>
                        <div className='overview-cell1'>Quote Ask/Bid</div>
                        <div className='overview-cell2'>
                            {lastQuote?.P ?? "n/a"} / {lastQuote?.p ?? "n/a"}
                        </div>
                    </div>
                    <div className="overview-row">
                        <div className='overview-cell1'>
                            {tickerMarket == "crypto" ? "Price" : "Open"}
                        </div>
                        <div className='overview-cell2'>
                            {previousClose?.[0]?.o ?? "n/a"}
                        </div>
                    </div>
                    <div className="overview-row">
                        <div className='overview-cell1'>{tickerMarket == "crypto" ? "24hr Trade" : "Last Trade"}</div>
                        <div className='overview-cell2'>{lastTrade?.p ?? "n/a"}</div>
                    </div>
                    <div className="overview-row">
                        <div className='overview-cell1'>{tickerMarket == "crypto" ? "24hr Volume" : "Volume"}</div>
                        <div className='overview-cell2'>
                            {totalVolume !== 0 ? totalVolume.toFixed(2) : "n/a"}
                        </div>
                    </div>
                    <div className="overview-row">
                        <div className='overview-cell1'>$ Volume</div>
                        <div className='overview-cell2'>
                            {totalDollarVolume > 0 ? totalDollarVolume.toFixed(2) : "n/a"}
                        </div>
                    </div>
                    <div className="overview-row">
                        <div className='overview-cell1'>No. of Trades</div>
                        <div className='overview-cell2'>
                            {totalNoOfTrades !== 0 ? totalNoOfTrades : "n/a"}
                        </div>
                    </div>
                    <div className={`overview-row ${tickerMarket == "crypto" ? "" : ""}`}>
                        <div className='overview-cell1'>Today Hi-Low</div>
                        <div className='overview-cell2'>
                            {openClose?.high ?? "n/a"} - {openClose?.low ?? "n/a"}
                        </div>
                    </div>
                    <div className="overview-row">
                        <div className='overview-cell1'>Year Hi-Low</div>
                        <div className='overview-cell2'>
                            {highLow52Week?.high ?? "n/a"} - {highLow52Week?.low ?? "n/a"}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default OverviewTab;