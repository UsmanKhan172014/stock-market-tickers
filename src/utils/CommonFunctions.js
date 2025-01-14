
export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formattedDateYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Subtract one day
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const formattedDataToday = () => {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export const formattedDate52WeeksAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7 * 52); // Subtract 52 weeks
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatTimestamp = (timestamp) => {
    const publishedTime = new Date(timestamp);
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDiff = currentTime - publishedTime;

    // Convert milliseconds to hours and minutes
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let timeAgo = '';
    if (hours > 0) {
        timeAgo += `${hours} ${hours === 1 ? 'hour' : 'hours'} ago . `;
    }
    if (minutes > 0 || timeAgo === '') {
        timeAgo += ` ${minutes} ${minutes === 1 ? 'min' : 'mins'} read`;
    }

    return timeAgo;
};

// Function to convert market cap value to million or billion
export const millionBillionNotation = (value) => {
    if (!value) {
        return;
    }

    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(2) + " billion";
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + " million";
    } else {
        return value.toFixed(2);
    }
};
