
const symbol = 'AAPL'; // Example stock symbol, you can make this dynamic
const baseUrl = '/.netlify/functions/fetch-data';

// Construct the full URL with query parameters



// Fetches stock data from Alpha Vantage
async function fetchStockData(symbol) {
    //const url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${symbol}&apikey=${apiKey}`;
    
    const queryParams = new URLSearchParams({
        function: 'EARNINGS',
        symbol: symbol
      });
    
    const urlWithParams = `${baseUrl}?${queryParams.toString()}`;

    try {
        // Make the fetch request to the Netlify function
        const data = await fetchData(urlWithParams);
        const rollingEarnings = calculateRollingEarnings(data.quarterlyEarnings);
        console.log(rollingEarnings);
        return rollingEarnings;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        
    }
}

async function fetchData(urlWithParams) {
    try {
      const response = await fetch(urlWithParams);
      const data = await response.json();
      console.log('Response from the function:', data);
      // Now you can return 'data' or do something else with it here
      return data; // For later use
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
// Processes the fetched data and displays the chart
async function displayChart() {
    console.log("Display chart");
    //const stockData = await fetchStockData(symbol);
    const chartData = await fetchStockData(symbol);
    // Assuming the API returns an array of yearly data including PE ratios
    // This part may need to be adjusted based on the actual API response format
    /** 
    const chartData = stockData.map(year => ({
        x: new Date(year.fiscalDateEnding),
        y: parseFloat(year.rollingTotalEPS)
    }));
    */

    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: `Trailing $Q EPS of ${symbol} Over 10 Years`
        },
        axisY: {
            title: "EPS",
        },
        data: [{
            type: "line",
            indexLabelFontSize: 16,
            dataPoints: chartData
        }]
    });

    chart.render();
}


function calculateRollingEarnings(quarterlyEarnings) {
    // Sort the earnings by fiscalDateEnding to ensure correct order
    quarterlyEarnings.sort((a, b) => new Date(a.fiscalDateEnding) - new Date(b.fiscalDateEnding));

    // Calculate rolling 4-quarter totals
    const rollingTotals = quarterlyEarnings.map((earnings, index, array) => {
        // Determine the start index for the 4-quarter range
        const startIndex = Math.max(0, index - 3);
        // Slice the last 4 quarters (or fewer if at the beginning of the array)
        const lastQuarters = array.slice(startIndex, index + 1);
        // Sum up the reportedEPS values of the last 4 quarters
        const totalEPS = lastQuarters.reduce((sum, current) => sum + parseFloat(current.reportedEPS), 0);
        
        return {
            /** 
            fiscalDateEnding: earnings.fiscalDateEnding,
            rollingTotalEPS: totalEPS.toFixed(2) // Keeping two decimal points for consistency
            */
            x: new Date(earnings.fiscalDateEnding),
            y: parseFloat(totalEPS.toFixed(2))            
        };
    });

    return rollingTotals;
}



// Define your query parameters
const queryParams = new URLSearchParams({
  userId: '123',
  type: 'example'
});





displayChart();
