import express from "express";
import CareerModel from "../models/Career.js";

const router = express.Router();

router.get("/getAll", async (req, res) => {
  try {
    const data = await CareerModel.find();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/today", async (req, res) => {
  try {
    // Get the current date
    const todayTimeStart = new Date();
    todayTimeStart.setUTCHours(0, 0, 0, 0);
    const todayStart = todayTimeStart.toISOString();

    // Get the current date
    const todayTimeEnd = new Date();
    todayTimeEnd.setUTCHours(23, 59, 59, 999);
    const todayEnd = todayTimeEnd.toISOString();
    const data = await CareerModel.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/week", async (req, res) => {
  try {
    const todayTime = new Date();
    // Set `today` to midnight UTC
    todayTime.setUTCHours(23, 59, 59, 999);
    const today = todayTime.toISOString();

    const weekTime = new Date();
    // Set `week` to midnight UTC (7 days ago)
    weekTime.setDate(weekTime.getDate() - 7);
    weekTime.setUTCHours(23, 59, 59, 999);
    const week = weekTime.toISOString();

    const data = await CareerModel.find({
      createdAt: { $gte: week, $lte: today },
    });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/month", async (req, res) => {
  try {
    // Get the current date
    const todayTime = new Date();
    // Set `today` to the last moment of the current day (23:59:59.999)
    todayTime.setUTCHours(23, 59, 59, 999);
    const today = todayTime.toISOString();

    // Get the first day of the current month
    const monthStartTime = new Date();
    monthStartTime.setUTCDate(1); // Set day to the first day of the month
    monthStartTime.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
    const monthStart = monthStartTime.toISOString();

    const data = await CareerModel.find({
      createdAt: { $gte: monthStart, $lte: today },
    });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/year", async (req, res) => {
  try {
    // Get the current date
    const todayTime = new Date();
    // Set `today` to the last moment of the current day (23:59:59.999)
    todayTime.setUTCHours(23, 59, 59, 999);
    const today = todayTime.toISOString();

    // Get the first day of the current year
    const yearStartTime = new Date();
    yearStartTime.setUTCMonth(0); // Set month to January (0-indexed)
    yearStartTime.setUTCDate(1); // Set day to the 1st
    yearStartTime.setUTCHours(0, 0, 0, 0); // Set time to midnight UTC
    const yearStart = yearStartTime.toISOString();

    const data = await CareerModel.find({
      createdAt: { $gte: yearStart, $lte: today },
    });
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

export default router;
