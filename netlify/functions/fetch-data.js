// netlify/functions/fetch-data.js
const axios = require('axios'); // You may need to install axios: npm install axios

exports.handler = async (event) => {
  const API_ENDPOINT = 'https://www.alphavantage.co/query';
  const API_KEY = process.env.ALPHA_VANTAGE; // Stored in Netlify Environment Variables
  const params = event.queryStringParameters;
  const queryParams = new URLSearchParams(params).toString();
  try {
    const API_STRING = `${API_ENDPOINT}?${queryParams}&apikey=${API_KEY}`;
    const response = await axios.get(API_STRING);
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify({error: "Failed to fetch data"})
    };
  }
};
