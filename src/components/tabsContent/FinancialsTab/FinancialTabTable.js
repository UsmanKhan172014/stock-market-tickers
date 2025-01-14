import React from 'react';
import { formatDate, millionBillionNotation } from '@/utils/CommonFunctions';

const FinancialTabTable = ({ data, tickerStats }) => {
    return (
        <div className="overview-tab mt-4">
            <div className="overview-row">
                <div className='overview-cell1'>Market Cap</div>
                <div className='overview-cell2'>
                    {millionBillionNotation(data?.tickerInfo?.results?.market_cap) ?? "n/a"}
                </div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Revenue</div>
                <div className='overview-cell2'>
                    {millionBillionNotation(data?.financials?.results[0]?.financials?.income_statement?.revenues?.value) ?? "n/a"}
                </div>
            </div>
            {/* <div className="overview-row">
                <div className='overview-cell1'>Net Income</div>
                <div className='overview-cell2'>n/a</div>
            </div> */}
            <div className="overview-row">
                <div className='overview-cell1'>Shares Out</div>
                <div className='overview-cell2'>
                    {millionBillionNotation(data?.tickerInfo?.results?.share_class_shares_outstanding) ?? "n/a"}
                </div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>EPS</div>
                <div className='overview-cell2'>
                    {data?.financials?.results[0]?.financials?.income_statement?.basic_earnings_per_share?.value?.toFixed(3) ?? "n/a"}
                </div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>PE Ratio</div>
                <div className='overview-cell2'>n/a</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Forward PF</div>
                <div className='overview-cell2'>n/a</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Divident PE</div>
                <div className='overview-cell2'>n/a</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Ex- Divident Date</div>
                <div className='overview-cell2'>{data?.dividends?.results[0]?.ex_dividend_date ?? "n/a"}</div>
            </div>
            {/* <div className="overview-row">
                <div className='overview-cell1'>Volume</div>
                <div className='overview-cell2'>{millionBillionNotation(tickerStats?.v) ?? "n/a"}</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Open</div>
                <div className='overview-cell2'>{tickerStats?.o ?? "n/a"}</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Day Range</div>
                <div className='overview-cell2'>n/a</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Analysts</div>
                <div className='overview-cell2'>n/a</div>
            </div>
            <div className="overview-row">
                <div className='overview-cell1'>Earnings Date</div>
                <div className='overview-cell2'>n/a</div>
            </div> */}
        </div>
    );
}

export default FinancialTabTable;