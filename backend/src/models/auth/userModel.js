import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please an email"],
      unique: true,
      trim: true,
      match: [
       /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password!"],
    },

    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },

    bio: {
      type: String,
      default: "I am a new user.",
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, minimize: true }
);

UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();  //This is important because you don’t want to re-hash a password every time the document is saved (e.g. when updating username or email).
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
});

const User = mongoose.model("User", UserSchema);

export default User;
