const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: "i" };

    const events = await Event.find(filter)
      .populate("organizer", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, authorize("admin", "faculty"), async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, organizer: req.user._id });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", protect, authorize("admin", "faculty"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.user.role !== "admin" && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own events" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, authorize("admin", "faculty"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (req.user.role !== "admin" && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own events" });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
