
import asyncHandler from "express-async-handler";
import User from "../../models/auth/userModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import Token from "../../models/auth/Token.js";
import hashToken from "../../helpers/hashToken.js";
import crypto from "node:crypto";
import sendEmail from "../../helpers/sendEmail.js";

// asyncHandler  dont need to use try/catch

export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be atleast 6 character" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: "User already exist" });
        return;
    }

    const user = await User.create({
        name, email, password
    });

    // generate token with user id
    const token = generateToken(user._id);

    // send back the user and token in the response to the client
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "none", // cross-site access --> allow all third-party cookies
        secure: true,
    });

    if (user) {
        const { _id, name, email, role, photo, bio, isVerified } = user

        res.status(201).json({
            _id, name, email, role, photo, bio, isVerified, token
        });

    } else {
        res.status(400).json({ message: "Invalid user data" });
    }

})

export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const userExists = await User.findOne({ email });

    if (!userExists) {
        return res.status(400).json({ message: "User not found" })
    }

    const matchPassword = await bcrypt.compare(password, userExists.password);

    if (!matchPassword) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    // generate token with user id
    const token = generateToken(userExists._id);
    if (userExists && matchPassword) {
        const { _id, name, email, role, photo, bio, isVerified } = userExists;

        // set the token in the cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: "none", // cross-site access --> allow all third-party cookies
            secure: true,
        });

        // send back the user and token in the response to the client
        res.status(200).json({
            _id,
            name,
            email,
            role,
            photo,
            bio,
            isVerified,
            token,
        });
    } else {
        res.status(400).json({ message: "Invalid email or password" });
    }

})

export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
    })
    res.status(200).json({ message: "User logged out" });

})

export const getUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password");
    if (user) {
        res.status(200).json(user);
    } else {
        // 404 Not Found
        res.status(404).json({ message: "User not found" });
    }
})

export const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {

        const { name, photo, bio } = req.body;

        user.name = name || user.name;
        user.photo = photo || user.photo;
        user.bio = bio || user.bio

        const updated = await user.save();
        res.status(200).json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            photo: updated.photo,
            bio: updated.bio,
            isVerified: updated.isVerified,
        });
    } else {
        // 404 Not Found
        res.status(404).json({ message: "User not found" });
    }

})


export const userLoginStatus = asyncHandler(async (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        // 401 Unauthorized
        res.status(401).json({ message: "Not authorized, please login!" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({ isLoggedIn: true });
    } catch (error) {
        res.status(401).json({ isLoggedIn: false, message: "Invalid or expired token" });
    }
});


export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // if user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // check if user is already verified
  if (user.isVerified) {
    return res.status(400).json({ message: "User is already verified" });
  }

  let token = await Token.findOne({ userId: user._id });

  // if token exists --> delete the token
  if (token) {
    await token.deleteOne();
  }

  // create a verification token using the user id --->
  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  // hast the verification token
  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }).save();

  // verification link
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // send email
  const subject = "Email Verification - AuthKit";
  const send_to = user.email;
  const reply_to = "ansarimohdhassan@gmail.com";
  const template = "emailVerification";
  const send_from = process.env.USER_EMAIL;
  const name = user.name;
  const url = verificationLink;

  try {
    // order matters ---> subject, send_to, send_from, reply_to, template, name, url
    await sendEmail(subject, send_to, send_from, reply_to, template, name, url);
    return res.json({ message: "Email sent" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent" });
  }
});