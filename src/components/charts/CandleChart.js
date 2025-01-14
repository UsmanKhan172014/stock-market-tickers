// // CandleChart.js
// import React, { useEffect, useState } from 'react';
// import { initializeWebSocketForStocks } from '@/api/socket';

// const CandleChart = () => {
//     const [messages, setMessages] = useState([]);
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         initializeWebSocketForStocks()
//             .then((ws) => {
//                 // WebSocket connection is established, you can subscribe to channels here
//                 ws.send('{"action":"subscribe", "params":"YOUR_CHANNEL"}');

//                 // Handle incoming messages
//                 ws.onmessage = (event) => {
//                     const message = JSON.parse(event.data);
//                     console.log('Received message:', message);
//                     setMessages((prevMessages) => [...prevMessages, message]);
//                     handleData(message);
//                 };
//             })
//             .catch((error) => {
//                 console.error('Failed to initialize WebSocket:', error);
//             });
//     }, []);

//     const handleData = (response) => {
//         // Log the received message and its event type
//         console.log('Received message type:', response.ev);

//         // Assuming 'AM' event type for candlestick data
//         if (response.ev === 'AM') {
//             const candleData = {
//                 time: new Date(response.startEpochTime).toLocaleDateString(),
//                 open: response.open,
//                 high: response.high,
//                 low: response.low,
//                 close: response.close,
//             };
//             console.log('Candlestick data:', candleData);
//             setData((prevData) => [...prevData, candleData]);
//         }
//     };

//     return (
//         <div>
//             <h1>WebSocket Messages</h1>
//             {messages.map((message, index) => (
//                 <div key={index}>{JSON.stringify(message)}</div>
//             ))}
//         </div>
//     );
// };

// export default CandleChart;




import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { formatDate } from '../../utils/CommonFunctions';

const CandleChart = ({ ticker, data }) => {
    const [graphData, setGraphData] = useState([]);
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [candleData, setCandleData] = useState([]);
    const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

    useEffect(() => {
        setGraphData(data);
        handleData(data);
        const ws = new WebSocket('wss://socket.polygon.io/stocks');

        ws.onopen = () => {
            ws.send(`{"action":"auth","params":"${API_KEY}"}`);
            ws.send(`{"action":"subscribe", "params":"AM.${ticker}"}`); // Subscribe to minute aggregates
        };

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.ev === 'status') {
                // console.log('Status Update:', response.message);
            } else {
                handleData(response);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleData = (response) => {
        if (!chartInstanceRef.current) {
            chartInstanceRef.current = createChart(chartContainerRef.current, { width: 800, height: 400 });
            chartInstanceRef.current.timeScale().fitContent();
        }

        const candleSeries = chartInstanceRef.current.addCandlestickSeries();

        response.forEach(item => {
            if (item && item.hasOwnProperty('time') && item.s !== null && item.s !== undefined) {
                const candle = {
                    time: formatDate(item.s),
                    open: item.o,
                    high: item.h,
                    low: item.l,
                    close: item.c,
                };
                setCandleData([...candleData, candle]);
            }
        });

        candleData.sort((a, b) => new Date(a.time) - new Date(b.time));

        if (candleData.length > 0) {
            candleSeries.setData(candleData);
        }
    };

    return (
        <div>
            <h1>WebSocket Messages</h1>
            <div ref={chartContainerRef} className='chart-container'></div>
        </div>
    );
};

export default CandleChart;