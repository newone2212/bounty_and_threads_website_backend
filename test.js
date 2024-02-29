const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/facebook-insights', async (req, res) => {
  try {
    // Convert timestamp strings to numbers
    const startTimestamp = parseInt(req.query.startDate, 10);
    const endTimestamp = parseInt(req.query.endDate, 10);

    // Create Date objects from timestamps
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);
    console.log(startDate)
    // Calculate the date range
    const dateRange = calculateDateRange(startDate, endDate);

    // Initialize an array to store results
    const results = [];

    // Loop through the date range
    for (const date of dateRange) {
      const formattedDate = formatDate(date);

      // Make the API request
      const url = `https://graph.facebook.com/v19.0/17841433401221135/insights?pretty=0&since=${date.getTime()/1000}&until=${(date.getTime()+86400000)/1000}&metric=follows_and_unfollows&metric_type=total_value&period=day&breakdown=follow_type&access_token=EAACyZBrKYZC58BOx56kbWRs3zdvZBz3XDf3NYna7O9CfhM1LYwL4DAf8CVRCW3Fo895zzVNvyjchSSZAMy5j089Ez800hV7mYvNyRYZBHe5L7eiPyfkH5uI8AB1Nse8JtdHAOlJ176Y8tHx2doFSAwMlHPhuP4LDPAWsd01GgzZBrUl0sX4m2rMLmP6WbZCcUrbCgi8gsAbT7KR1KRcdzeZC06aY7fI6TGWaoQZDZD`;
      const response = await axios.get(url);

      // Append the result to the array
      results.push({
        date: formattedDate,
        data: response.data,
      });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

function calculateDateRange(startDate, endDate) {
  const dateRange = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
