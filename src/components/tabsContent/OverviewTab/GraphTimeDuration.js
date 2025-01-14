import React from 'react';

const GraphTimeDuration = ({ activeGraphButton, fetchGraphDataHandler }) => {

  return (
    <div className="graph-time-duration mt-3">
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'first' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(1, "day", "first", false)}
      >
        1 Day
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'second' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(1, 'week', "second", false)}
      >
        1 Week
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'third' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(1, 'month', "third", false)}
      >
        1 Month
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'fourth' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(3, 'month', "fourth", false)}
      >
        3 Months
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'fifth' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(6, 'month', "fifth", false)}
      >
        6 Months
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'sixth' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(1, 'year', "sixth", false)}
      >
        1 Year
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'seventh' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(5, 'year', "seventh", false)}
      >
        5 Years
      </button>
      <button
        className={`btn graph-date-range-button ${activeGraphButton === 'eighth' ? 'graph-date-range-active-button' : ''}`}
        onClick={() => fetchGraphDataHandler(10, 'year', "eighth", false)}
      >
        All
      </button>
    </div>
  )
}

export default GraphTimeDuration