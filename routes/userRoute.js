import express from "express";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();

router.get("/getAll", async (req, res) => {
  const users = await UserModel.find().sort({ createdAt: -1 });
  res.send(users);
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.send("Delete");
  } catch (error) {
    console.log(error);
  }
});

router.get("/today", async (req, res) => {
  try {
    const { order, type } = req.query;
    const query = {};
    const queryOuter = {};

    // Get the current date
    const todayTimeStart = new Date();
    todayTimeStart.setUTCHours(0, 0, 0, 0);
    const todayStart = todayTimeStart.toISOString();

    // Get the current date
    const todayTimeEnd = new Date();
    todayTimeEnd.setUTCHours(23, 59, 59, 999);
    const todayEnd = todayTimeEnd.toISOString();

    // Query Builder
    queryOuter.createdAt = order ? Number(order) : 1;
    query.createdAt = { $gte: todayStart, $lte: todayEnd };
    if (type) {
      query.isPremium = JSON.parse(type);
    }

    const result = await UserModel.find(query)
      .sort(queryOuter)
      .select("-password");
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/week", async (req, res) => {
  try {
    const { order, type } = req.query;
    const query = {};
    const queryOuter = {};

    const todayTime = new Date();
    // Set `today` to midnight UTC
    todayTime.setUTCHours(23, 59, 59, 999);
    const today = todayTime.toISOString();

    const weekTime = new Date();
    // Set `week` to midnight UTC (7 days ago)
    weekTime.setDate(weekTime.getDate() - 7);
    weekTime.setUTCHours(23, 59, 59, 999);
    const week = weekTime.toISOString();

    // Query Builder
    queryOuter.createdAt = order ? Number(order) : 1;
    query.createdAt = { $gte: week, $lte: today };
    if (type) {
      query.isPremium = JSON.parse(type);
    }

    const result = await UserModel.find(query)
      .sort(queryOuter)
      .select("-password");
    res.json(result); // Send the result as a JSON response
  } catch (error) {
    console.error(error); // Log error
    res.status(500).json({ error: "Server error" }); // Send an error response
  }
});

router.get("/month", async (req, res) => {
  try {
    const { order, type } = req.query;
    const query = {};
    const queryOuter = {};
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

    // Query Builder
    queryOuter.createdAt = order ? Number(order) : 1;
    query.createdAt = { $gte: monthStart, $lte: today };
    if (type) {
      query.isPremium = JSON.parse(type);
    }

    const result = await UserModel.find(query)
      .sort(queryOuter)
      .select("-password");
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/year", async (req, res) => {
  try {
    const { order, type } = req.query;
    const query = {};
    const queryOuter = {};
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

    // Query Builder
    queryOuter.createdAt = order ? Number(order) : 1;
    query.createdAt = { $gte: yearStart, $lte: today };
    if (type) {
      query.isPremium = JSON.parse(type);
    }

    const result = await UserModel.find(query)
      .sort(queryOuter)
      .select("-password");
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.get("/newest-oldest", async (req, res) => {
  try {
    const usersData = await UserModel.find().sort({ createdAt: -1 });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/oldest-newest", async (req, res) => {
  try {
    const usersData = await UserModel.find().sort({ createdAt: 1 });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/free", async (req, res) => {
  try {
    const usersData = await UserModel.find({ isPremium: false });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/premium", async (req, res) => {
  try {
    const usersData = await UserModel.find({ isPremium: true });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/newest-oldest-premium", async (req, res) => {
  try {
    const usersData = await UserModel.find({ isPremium: true }).sort({
      createdAt: -1,
    });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/oldest-newest-free", async (req, res) => {
  try {
    const usersData = await UserModel.find({ isPremium: false }).sort({
      createdAt: 1,
    });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/newest-oldest-free", async (req, res) => {
  try {
    const usersData = await UserModel.find({ isPremium: false }).sort({
      createdAt: -1,
    });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});
router.get("/oldest-newest-premium", async (req, res) => {
  try {
    const usersData = await UserModel.find({ isPremium: true }).sort({
      createdAt: 1,
    });
    res.json(usersData);
  } catch (error) {
    console.log(error);
  }
});

router.get("/week-for-chart-users", async (req, res) => {
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
      const data = await UserModel.find({
        createdAt: { $gte: datesArr[i].startDate, $lte: datesArr[i].endDate },
      }).select("-password"); // .countDocuments() is more efficient than using .length

      resultArr.push({
        data,
        length: data.length,
        dayName: datesArr[i].dayName,
      });
    }
    res.json(resultArr);
  } catch (error) {
    console.log(error);
  }
});
router.get("/week-for-chart-premium", async (req, res) => {
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
      const dayName = formatDate(date);

      datesArr.push({ startDate: startOfDay, endDate: endOfDay, dayName });
    }
    // Query traffic for each of the last 7 days
    const resultArr = [];
    for (let i = 0; i < datesArr.length; i++) {
      const data = await UserModel.find({
        createdAt: { $gte: datesArr[i].startDate, $lte: datesArr[i].endDate },
        isPremium: true,
      }).select("-password"); // .countDocuments() is more efficient than using .length

      resultArr.push({
        data,
        length: data.length,
        dayName: datesArr[i].dayName,
      });
    }
    res.json(resultArr);
  } catch (error) {
    console.log(error);
  }
});

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad single digit with leading 0
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed, so add 1)
  const year = date.getFullYear(); // Get full year

  return `${day}/${month}/${year}`; // Return formatted string
}

router.get("/check-admin", async (req, res) => {
  try {
    const token = req.cookies.HSPadminId;
    if (!token)
      return res
        .status(404)
        .json({ success: false, message: "Token not found" });
    const { email, password } = jwt.verify(token, process.env.JWT_SECRET);
    if (email === "admin@gmail.com" && password === "admin") {
      return res.status(200).json({ success: true, message: "User is valid" });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "User is not valid" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login-admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "admin@gmail.com" && password === "admin") {
      const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
      res.cookie("HSPadminId", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });
      res
        .status(201)
        .json({ success: true, message: "User login successfully" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Email or password is wrong" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout-user", async (req, res) => {
  try {
    const token = req.cookies.HSPadminId;
    if (!token) {
      res.clearCookie("HSPadminId");
      return res.status(404).json({
        success: false,
        message: "Token not found but still removed",
      });
    }

    res.clearCookie("HSPadminId");
    res.cookie("HSPadminId", "");
    res.status(200).json({ success: true, message: "Token was deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
