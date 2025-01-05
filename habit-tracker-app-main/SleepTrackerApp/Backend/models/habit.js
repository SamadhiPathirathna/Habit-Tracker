// models/habit.js
const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  repeatMode: {
    type: String,
    enum: ["Daily", "Weekly", "Everyday"],
    required: true,
  },
  timeOfDay: {
    type: String,
    enum: ["Anytime", "Morning", "Afternoon", "Evening"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "incomplete"],
    default: "pending",
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: Date,
    default: null,
  },
  completed: {
    type: Map,
    of: Boolean,
    default: {},
  },
  skipped: {
    type: Map,
    of: Boolean,
    default: {},
  },
  incomplete: {
    type: Map,
    of: Boolean,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastChecked: {
    type: Date,
    default: null,
  }
});

module.exports = mongoose.model("Habit", habitSchema);
