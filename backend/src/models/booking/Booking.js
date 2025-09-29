import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 👈 links Booking → User
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "Wedding",
        "Birthday Party",
        "Engagement",
        "Cocktail Party",
        "Corporate Event",
        "Get Together",
        "Other",
      ],
    },
    otherEventText: { type: String, trim: true },
    date: { type: Date },
    time: {
      hour: { type: Number, min: 0, max: 23 },
      minute: { type: Number, min: 0, max: 59 },
      period: { type: String, enum: ["AM", "PM"] },
    },
    budget: {
      type: String,
      enum: ["₹700-₹1000", "₹1000-₹1250", "₹2000+"],
    },
    guests: { type: Number, min: 1 },
    contact: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
