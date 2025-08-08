import toast from "react-hot-toast";
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserContext = createContext();
axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {

    const serverUrl = "http://localhost:8000";
    const router = useRouter();

    const [allUsers, setAllUsers] = useState([])

    const [user, setUser] = useState({})
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [updateState, setUpdateState] = useState({
        name: "",
        bio: "",
        photo: ""
    });
    const handleUpdateInput = (field) => (e) => {
        setUpdateState((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
    const [loading, setLoading] = useState(false);

    const handlerUserInput = (name) => (e) => {
        const value = e.target.value;

        setUserState((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    useEffect(() => {
        userLoginStatus();
    }, []);

    // register user
    const registerUser = async (e) => {
        e.preventDefault();
        console.log("registerUser called");
        if (
            !userState.name ||
            !userState.email.includes("@") ||
            userState.password.length < 6 ||
            !userState.password
        ) {
            toast.error("Please enter a valid email and password (min 6 characters)");
            return;
        }
        try {
            const res = await axios.post(`${serverUrl}/api/v1/register`, userState)
            console.log("User registered successfully", res.data);
            toast.success("User registered successfully");

            setUserState({
                name: "",
                email: "",
                password: ""
            })

            router.push('/login')
        } catch (error) {
            console.log("Error registering user", error);
            toast.error(error.response.data.message);
        }
    }
    // loginUser
    const loginUser = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${serverUrl}/api/v1/login`, {
                email: userState.email,
                password: userState.password
            }, { withCredentials: true })

            toast.success("User login successfully");
            setUserState({
                email: "",
                password: ""
            });
            await getUser();
            router.push("/")
        } catch (error) {
            console.log("Error logging in user", error);

            // Safely access error message with fallback
            const message = error?.response?.data?.message || "Login failed";
            toast.error(message);
        }
    }

    // login status
    const userLoginStatus = async () => {
        let loggedIn = false;
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
                withCredentials: true
            });

            loggedIn = !!res.data;
            setLoading(false)

            if (!loggedIn) {
                router.push('/login')
            }
        } catch (error) {
            console.log("Error getting user login status", error);
        }
        return loggedIn;
    }

    // logout user
    const logout = async () => {

        try {
            const res = await axios.get(`${serverUrl}/api/v1/logout`, {
                withCredentials: true
            })
            toast.success("User logout successfully");
            router.push('/login');

        } catch (error) {
            console.log("Error getting user login status", error);
        }
    }

    //get user
    const getUser = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${serverUrl}/api/v1/user`, {
                withCredentials: true
            });
            setUser((prevState) => {
                return {
                    ...prevState,
                    ...res.data,
                }
            })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("Error getting user insights", error);
        }
    }
    useEffect(() => {
        const loginStatusGetUser = async () => {
            const loggedInUser = await userLoginStatus();
            if (loggedInUser) {
                await getUser();
            }
        }
        loginStatusGetUser();
    }, [])

    //update user
    const updateUser = async (e, data) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
                withCredentials: true
            })

            setUser((prevState) => {
                return {
                    ...prevState,
                    ...res.data,
                }
            });
            toast.success("User updated successfully");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to update user");
            console.log("Error updating user", error);
        }
    }

    const emailVerification = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/verify-email`, { withCredentials: true });
            toast.success("Email verification sent successfully");
            setLoading(false);
        } catch (error) {
            console.log("Error sending email verification", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    const verifyUser = async (token) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/verify-user/${token}`, {
                withCredentials: true
            });
            toast.success("User verified successfully");
            // refresh the user details
            await getUser();

            setLoading(false);
            router.push("/");
        } catch (error) {
            console.log("Error verifying user", error);
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    const forgotPasswordEmail = async (email) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/forgot-password`, { email }, { withCredentials: true });
            toast.success("Email verification sent successfully");
            setLoading(false);
        } catch (error) {
            console.log("Error sending email verification", error);
            setLoading(false);
            toast.error(error.response.data.message);
        }
    }

    const resetPassword = async (token, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/v1/reset-password/${token}`, { password }, {
                withCredentials: true
            });
            toast.success("Password changed successfully");
            // refresh the user details
            await getUser();

            setLoading(false);
            router.push("/login");
        } catch (error) {
            console.log("Error changing password", error);
            toast.error(error.response.data.message);
            setLoading(false);
        }
    }

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/v1/users`, { withCredentials: true });
            setAllUsers(res.data)
            setLoading(false);
        } catch (error) {
            console.log("Error while getting users", error);
            toast.error("error");
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.role === 'admin') {
            getAllUsers()
        }
    }, [user.role]);

    const deleteUser = async (id) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${serverUrl}/api/v1/admin/users/${id}`, {withCredentials: true});
            setLoading(false);
            toast.success("user deleted");
            getAllUsers()
        } catch (error) {
            console.log("Error while getting users", error);
            toast.error("error while deleting user");
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logout,
            userLoginStatus,
            user,
            updateUser,
            updateState,
            handleUpdateInput,
            emailVerification,
            verifyUser,
            forgotPasswordEmail,
            resetPassword,
            allUsers,
            deleteUser

        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    return useContext(UserContext);
}