
import asyncHandler from "express-async-handler";
import User from "../../models/auth/userModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcrypt from "bcrypt";

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
        return res.status(400).json({ message: "User already exist" })
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
    console.log(password, userExists.password);

    const matchPassword = await bcrypt.compare(password, userExists.password);
    console.log(matchPassword);
    
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