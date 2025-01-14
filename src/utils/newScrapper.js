import axios from "axios";

export const fetchNewsDetails = async (pageUrl) => {
    try {
        return;
        // // Fetch webpage
        // const response = await axios.get(pageUrl);
        // const $ = Cheerio.load(response.data);

        // // Extract data
        // const pageTitle = $('title').text();

        // // Return data as props
        // return {
        //     props: {
        //         title: pageTitle
        //     }
        // };
    } catch (error) {
        // console.error(error);
        // return {
        //     props: {
        //         error: 'Failed to fetch data'
        //     }
        // };
        return;
    }
}