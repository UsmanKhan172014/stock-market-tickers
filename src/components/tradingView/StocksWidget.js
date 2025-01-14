import React, { useEffect, useRef, memo, useState } from 'react';

function StocksWidget() {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const container = useRef();

    const drawTradingViewGraph = () => {
        if (!scriptLoaded) {
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
            script.type = "text/javascript";
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.innerHTML = `{
                    "symbols": [
                      [
                        "Apple",
                        "AAPL|1D"
                      ],
                      [
                        "Google",
                        "GOOGL|1D"
                      ],
                      [
                        "Microsoft",
                        "MSFT|1D"
                      ]
                    ],
                    "chartOnly": true,
                    "width": "100%",
                    "height": "100%",
                    "locale": "en",
                    "colorTheme": "light",
                    "autosize": true,
                    "showVolume": false,
                    "showMA": false,
                    "hideDateRanges": false,
                    "hideMarketStatus": false,
                    "hideSymbolLogo": false,
                    "scalePosition": "left",
                    "scaleMode": "Normal",
                    "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                    "fontSize": "10",
                    "noTimeScale": false,
                    "valuesTracking": "1",
                    "changeMode": "price-and-percent",
                    "chartType": "area",
                    "maLineColor": "#2962FF",
                    "maLineWidth": 1,
                    "maLength": 9,
                    "lineWidth": 2,
                    "lineType": 0,
                    "dateRanges": [
                      "1d|1",
                      "1w|15",
                      "1m|30",
                      "3m|60",
                      "12m|1D",
                      "60m|1W",
                      "all|1M"
                    ],
                    "lineColor": "rgba(76, 175, 80, 1)",
                    "topColor": "rgba(195, 226, 196, 1)",
                    "bottomColor": "rgba(255, 255, 255, 1)"
                  }`;
            container.current.appendChild(script);
        }
    }

    const extraFunctionForPloting = () => {
        setScriptLoaded(true);
        if (!scriptLoaded) {
            drawTradingViewGraph();
        }
    }
    useEffect(() => {
        extraFunctionForPloting();
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ overflowY: 'hidden !important' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default StocksWidget;
// memo(StocksWidget)