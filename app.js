const express = require("express");
const ExpressError = require("./expressError");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/mean", function (req, res, next) {
  try {
    let nums = req.query.nums;

    // Check if 'nums' is provided
    if (!nums) {
      throw new ExpressError("Query parameter 'nums' is required", 400);
    }

    // Split the 'nums' string into an array
    const numArray = nums.split(",");

    // Initialize result and validate each number
    let result = 0;
    for (let num of numArray) {
      const parsedNum = parseInt(num);

      // Check if the parsed value is a valid integer
      if (isNaN(parsedNum)) {
        throw new ExpressError(`'${num}' is not a valid integer`, 400);
      }

      result += parsedNum;
    }

    // Calculate the mean
    const mean = result / numArray.length;

    // Return the response
    return res.status(200).json({
      response: {
        operation: "mean",
        value: mean,
      },
    });
  } catch (e) {
    next(e);
  }
});

app.get("/median", function (req, res, next) {
  try {
    let nums = req.query.nums;

    // Check if 'nums' is provided
    if (!nums) {
      throw new ExpressError("Query parameter 'nums' is required", 400);
    }

    // Split the 'nums' string into an array
    const numArray = nums.split(",");

    // Initialize result array and validate each number
    let result = [];
    for (let num of numArray) {
      const parsedNum = parseInt(num);

      // Check if the parsed value is a valid integer
      if (isNaN(parsedNum)) {
        throw new ExpressError(`'${num}' is not a valid integer`, 400);
      }

      // Add parsed number to the result array
      result.push(parsedNum);
    }

    // Sort the array and find the median
    result.sort((a, b) => a - b);

    const n = result.length;
    let median;

    if (n % 2 !== 0) {
      // Odd length: return the middle element
      median = result[Math.floor(n / 2)];
    } else {
      // Even length: return the average of the two middle elements
      const mid1 = result[n / 2 - 1];
      const mid2 = result[n / 2];
      median = (mid1 + mid2) / 2;
    }

    // Return the response
    return res.status(200).json({
      response: {
        operation: "median",
        value: median,
      },
    });
  } catch (e) {
    next(e);
  }
});


app.get("/mode", function (req, res, next) {
  try {
    let nums = req.query.nums;

    // Check if 'nums' is provided
    if (!nums) {
      throw new ExpressError("Query parameter 'nums' is required", 400);
    }

    // Split the 'nums' string into an array
    const numArray = nums.split(",");

    // Initialize frequency object and validate each number
    let frequency = {};
    for (let num of numArray) {
      const parsedNum = parseInt(num);

      // Check if the parsed value is a valid integer
      if (isNaN(parsedNum)) {
        throw new ExpressError(`'${num}' is not a valid integer`, 400);
      }

      // Increment frequency count
      if (frequency[parsedNum]) {
        frequency[parsedNum] += 1;
      } else {
        frequency[parsedNum] = 1;
      }
    }

    // Find the mode (key with the highest frequency)
    let mode = null;
    let maxFrequency = 0;

    for (let key in frequency) {
      if (frequency[key] > maxFrequency) {
        maxFrequency = frequency[key];
        // Convert back to a number
        mode = Number(key);
      }
    }

    // Return the response
    return res.status(200).json({
      response: {
        operation: "mode",
        value: mode,
      },
    });
  } catch (e) {
    next(e);
  }
});

// If no other route matches, respond with a 404
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

app.use(function (err, req, res, next) {
  // the default status is 500 internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
