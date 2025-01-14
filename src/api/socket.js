// utils/webSocketForStocks.js
const APIKEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

let webSocketForStocks = null;
let attempts = 0;

const initializeWebSocketForStocks = () => {
    return new Promise((resolve, reject) => {

        if (webSocketForStocks) {
            resolve(webSocketForStocks);
        } else {
            const ws = new WebSocket('wss://delayed.polygon.io/stocks');
            if (attempts < 1) {
                attempts++;

                ws.onopen = () => {
                    // console.log('Connected to WebSocket for stocks!');

                    ws.send(`{"action":"auth","params":"${APIKEY}"}`);
                    webSocketForStocks = ws;
                    resolve(webSocketForStocks);
                };
            } else {
                reject();
            }

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                // console.log('Received message:', message);
            };
        }

    });
};

export {
    initializeWebSocketForStocks
};
