const express = require("express");
const cron = require("node-cron");
const router = express.Router();
const Habit = require("../models/habit");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const recommendationServiceURL = "http://127.0.0.1:5001/recommendation"; // URL to your Flask API

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = user.userId;
    next();
  });
}

// Add a new habit (authenticated)
router.post("/addhabit", authenticateToken, async (req, res) => {
  try {
    const { title, color, repeatMode, timeOfDay, reminder, reminderTime } = req.body;

    if (!title || !color || !repeatMode || !timeOfDay) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const habit = new Habit({
      userId: req.userId,
      title,
      color,
      repeatMode,
      timeOfDay,
      reminder,
      reminderTime: reminder && reminderTime ? new Date(reminderTime) : null,
      completed: {},
      skipped: {},
      incomplete: {} // Initialize empty object for incompletes
    });

    await habit.save();
    res.status(200).json({ status: "New habit added", habit });
  } catch (error) {
    console.error("Error in addhabit route:", error);  // Log the full error
    res.status(500).json({ error: "Error adding habit" });
  }
});


// Daily habit check to mark unmarked habits as "incomplete" (runs every midnight)
cron.schedule("0 0 * * *", async () => {
  const todayDate = new Date().toISOString().split("T")[0];
  console.log("Running daily habit check...");

  try {
    const habits = await Habit.find({ repeatMode: "Daily" });
    for (const habit of habits) {
      const isCompleted = habit.completed.get(todayDate);
      const isSkipped = habit.skipped.get(todayDate);

      if (!isCompleted && !isSkipped) {
        habit.incomplete.set(todayDate, true);
        habit.status = "incomplete";
        await habit.save();
      }
    }
    console.log("Daily habit check completed.");
  } catch (error) {
    console.error("Error in daily habit check:", error);
  }
});

// Get all habits specific to the logged-in user
router.get("/gethabits", authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).populate("userId", "profilePicture username");
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// Edit a habit by ID (authenticated)
router.put("/edit/:id", authenticateToken, async (req, res) => {
  const { title, color, repeatMode, timeOfDay, reminder, reminderTime } = req.body;

  if (!title || !color || !repeatMode || !timeOfDay) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, color, repeatMode, timeOfDay, reminder, reminderTime },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a habit by ID (authenticated)
router.delete("/deletehabit/:id", authenticateToken, async (req, res) => {
  try {
    const deletedHabit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    return res.status(200).json({ status: "Habit Deleted", deletedHabit });
  } catch (error) {
    res.status(500).json({ error: "Error deleting habit" });
  }
});

// Mark habit completion status (completed, skipped, or incomplete) (authenticated)
router.put("/status/:habitId", authenticateToken, async (req, res) => {
  const habitId = req.params.habitId;
  const { status } = req.body;
  const currentDate = new Date().toISOString().split("T")[0]; // Use ISO format (YYYY-MM-DD)

  try {
    let habit = await Habit.findOne({ _id: habitId, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    // Ensure all status fields exist as Maps if not already initialized
    if (!habit.completed) habit.completed = new Map();
    if (!habit.skipped) habit.skipped = new Map();
    if (!habit.pending) habit.pending = new Map();

    // Set status for the current date only, reset other states
    if (status === "completed") {
      habit.completed.set(currentDate, true);
      habit.skipped.set(currentDate, false);
      habit.pending.set(currentDate, false);
    } else if (status === "skipped") {
      habit.skipped.set(currentDate, true);
      habit.completed.set(currentDate, false);
      habit.pending.set(currentDate, false);
    } else if (status === "pending") {
      habit.pending.set(currentDate, true);
      habit.completed.set(currentDate, false);
      habit.skipped.set(currentDate, false);
    }

    await habit.save();
    return res.status(200).json(habit); // Return the updated habit
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Get habit statistics for the current day and the last 7 days (authenticated)
router.get("/statistics", authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    const currentDate = new Date().toISOString().split("T")[0];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    let stats = {
      completedHabits: 0,
      pendingHabits: 0,
      skippedHabits: 0,
      weeklyCompletedHabits: Array(7).fill(0),
      weeklySkippedHabits: Array(7).fill(0),
      weeklyIncompleteHabits: Array(7).fill(0),
      mostCompletedHabit: null,
      mostSkippedHabit: null,
    };

    const habitCompletionCounts = {};
    const habitSkipCounts = {};

    habits.forEach((habit) => {
      if (habit.completed?.get(currentDate)) {
        stats.completedHabits += 1;
      } else if (habit.pending?.get(currentDate)) {
        stats.pendingHabits += 1;
      } else if (habit.skipped?.get(currentDate)) {
        stats.skippedHabits += 1;
      }
      last7Days.forEach((date, index) => {
        if (habit.completed?.get(date)) {
          stats.weeklyCompletedHabits[index] += 1;
          habitCompletionCounts[habit.title] = (habitCompletionCounts[habit.title] || 0) + 1;
        } else if (habit.skipped?.get(date)) {
          stats.weeklySkippedHabits[index] += 1;
          habitSkipCounts[habit.title] = (habitSkipCounts[habit.title] || 0) + 1;
        } else if (habit.incomplete?.get(date)) {
          stats.weeklyIncompleteHabits[index] += 1;
        }
      });
    });

    // Determine the most completed habit
    stats.mostCompletedHabit = Object.keys(habitCompletionCounts).reduce((a, b) =>
      habitCompletionCounts[a] > habitCompletionCounts[b] ? a : b, null
    );

    // Determine the most skipped habit
    stats.mostSkippedHabit = Object.keys(habitSkipCounts).reduce((a, b) =>
      habitSkipCounts[a] > habitSkipCounts[b] ? a : b, null
    );

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Fetch recommendations from Flask API
router.get("/recommendations", authenticateToken, async (req, res) => {
  try {
    const userProfile = await User.findById(req.userId).select('age gender lifestyle');
    const habits = await Habit.find({ userId: req.userId }).select('title');

    const recommendationData = {
      age: userProfile.age,
      gender: userProfile.gender,
      lifestyle: userProfile.lifestyle,
      habits: habits.map(habit => habit.title.trim())
    };

    console.log("Recommendation Data:", recommendationData);  // Debugging line for request data

    const response = await axios.post(recommendationServiceURL, recommendationData);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
});

// Helper functions
const getFormattedDate = (date) => date.toISOString().split("T")[0];

const getLast7Days = () => {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    days.push(getFormattedDate(date));
  }
  return days;
};


module.exports = router;