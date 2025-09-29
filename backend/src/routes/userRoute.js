import express from "express";
import { changePassword, forgotPassword, getUser, loginUser, logoutUser, registerUser, resetPassword, updateUser, userLoginStatus, verifyEmail, verifyUser } from "../controllers/auth/userController.js";
import { adminMiddleware, creatorMiddleware, protect } from "../middleware/authMiddleware.js";
import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";
import {createBooking, getAllBookings, deleteBooking} from "../controllers/booking/userBooking.js"

const router = express.Router()


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/user',protect, getUser);
router.patch("/user", protect, updateUser); //Update only specific fields (partial update)


router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

router.get("/users",protect, creatorMiddleware, getAllUsers);

router.get("/login-status", userLoginStatus);

router.post("/verify-email", protect, verifyEmail);

router.post("/verify-user/:verificationToken", verifyUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetPasswordToken", resetPassword);

router.patch("/change-password", protect, changePassword);

// bookings

router.post("/bookings", protect,  createBooking);

router.get("/get-bookings", protect, creatorMiddleware, getAllBookings);

router.delete("/admin/bookings/:id", protect, adminMiddleware, deleteBooking);


export default router;