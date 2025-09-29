// import Booking from "../models/Booking.js";
import Booking from "../../models/booking/Booking.js"
// import User from "../../models/auth/userModel.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Check if a booking already exists for same user + eventType + date + time
    const existingBooking = await Booking.findOne({
      user: userId,
      eventType: req.body.eventType,
      date: req.body.date,
      time: req.body.time,
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "You already have a booking for this event, date and time.",
      });
    }

    // 🔹 If no duplicate, create new booking
    const booking = new Booking({
      ...req.body,
      user: userId,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only admin or the user who created the booking can delete
    if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this booking" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
