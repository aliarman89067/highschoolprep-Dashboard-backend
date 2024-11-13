import express from "express";
import TrafficModel from "../models/Traffic.js";

const router = express.Router();

router.get("/week", async (req, res) => {
  try {
    const getStartEndOfDay = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo); // Adjust the date by `daysAgo`
      date.setUTCHours(0, 0, 0, 0); // Start of the day (00:00:00)
      const startOfDay = date.toISOString(); // Start of the day in ISO format
      date.setUTCHours(23, 59, 59, 999); // End of the day (23:59:59)
      const endOfDay = date.toISOString(); // End of the day in ISO format
      return { startOfDay, endOfDay, date };
    };

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Prepare the date ranges for the past 6 days
    const datesArr = [];
    for (let i = 6; i >= 0; i--) {
      const { startOfDay, endOfDay, date } = getStartEndOfDay(i);
      const dayName = dayNames[date.getUTCDay()];
      datesArr.push({ startDate: startOfDay, endDate: endOfDay, dayName });
    }
    // Query traffic for each of the last 7 days
    const resultArr = [];
    for (let i = 0; i < datesArr.length; i++) {
      const dataCount = await TrafficModel.find({
        createdAt: { $gte: datesArr[i].startDate, $lte: datesArr[i].endDate },
      }).countDocuments(); // .countDocuments() is more efficient than using .length
      resultArr.push({ length: dataCount, name: datesArr[i].dayName });
    }
    res.json(resultArr);
  } catch (error) {
    console.log(error);
  }
});

router.get("/month", async (req, res) => {
  try {
    const currentDate = new Date(); // Get today's date

    // Set start time of the current date to 00:00:00.000
    const startOfCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));

    // Calculate the date one month ago
    const oneMonthAgo = new Date(startOfCurrentDate);
    oneMonthAgo.setMonth(startOfCurrentDate.getMonth() - 1); // Subtract one month

    const dateRanges = [];

    let startDate = new Date(oneMonthAgo); // Start from 1 month ago
    startDate.setHours(0, 0, 0, 0); // Set the start time to 00:00:00.000

    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3); // Set the end date to 3 days after start date
    endDate.setHours(23, 59, 59, 999); // Set the end time to 23:59:59.999

    // Generate 3-day intervals until today
    while (endDate <= startOfCurrentDate) {
      dateRanges.push({
        start: new Date(startDate), // Clone start date to avoid reference issues
        end: new Date(endDate), // Clone end date to avoid reference issues
      });

      // Move to the next 3-day interval
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0); // Ensure start time is at 00:00:00.000
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 3); // Add 3 days to the current interval
      endDate.setHours(23, 59, 59, 999); // Ensure end time is at 23:59:59.999
    }

    const resultArr = [];

    for (let i = 0; i <= dateRanges.length - 1; i++) {
      const range = dateRanges[i];

      // Use the range to query the database
      const data = await TrafficModel.find({
        createdAt: {
          $gte: range.start,
          $lt: range.end,
        },
      });
      resultArr.push({ length: data.length }); // Push the count of data for each 3-day range
    }

    res.status(200).json(resultArr);
  } catch (error) {
    console.log(error);
  }
});
router.get("/year", async (req, res) => {
  try {
    const currentDate = new Date(); // Get today's date

    // Set start time of the current date to 00:00:00.000
    const startOfCurrentDate = new Date(currentDate.setHours(0, 0, 0, 0));

    const dateRanges = [];

    let startDate = new Date(startOfCurrentDate); // Start from today
    startDate.setDate(1); // Set to the first day of the current month
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    let endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1); // Set to the first day of the next month
    endDate.setHours(23, 59, 59, 999); // Set end time to 23:59:59.999

    // Generate monthly intervals for the last 12 months
    for (let i = 0; i < 12; i++) {
      dateRanges.push({
        start: new Date(startDate), // Clone start date
        end: new Date(endDate), // Clone end date
      });

      // Move to the previous month
      startDate = new Date(startDate);
      startDate.setMonth(startDate.getMonth() - 1); // Go to the previous month
      startDate.setDate(1); // Set to the first day of the month
      startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); // Move to the first day of the next month
      endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
    }

    const resultArr = [];

    // Loop through the date ranges and query the database for each month
    for (let i = dateRanges.length - 1; i >= 0; i--) {
      const range = dateRanges[i];

      // Query the database for traffic data within the monthly range
      const data = await TrafficModel.find({
        createdAt: {
          $gte: range.start,
          $lt: range.end,
        },
      });
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      // Push the count of records for each month into the result array
      resultArr.push({
        name: monthNames[range.start.getMonth()], // Display month as 1-indexed
        // year: range.start.getFullYear(),
        length: data.length, // Count of records in that month
      });
    }

    // Return the result array as the response

    res.status(200).json(resultArr);
  } catch (error) {
    console.log(error);
  }
});

export default router;
