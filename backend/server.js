import express, { urlencoded } from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from './src/db/connect.js';
import fs, { readFileSync } from "node:fs";

dotenv.config()

const port = process.env.PORT || 800

const app = express();


// middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
})); //If your frontend (e.g., running on http://localhost:3000) tries to fetch data from your backend (e.g., http://localhost:5000), the browser will block it unless your backend allows that origin.

app.use(express.json()); //JSON bodies
app.use(express.urlencoded({ extended: true })); //HTML form data
app.use(cookieParser()); //	Cookies from headers

const routeFiles = fs.readdirSync('./src/routes');

routeFiles.forEach((file) => {
    import(`./src/routes/${file}`)
        .then((route) => {
            app.use("/api/v1/", route.default)
        })
        .catch((err) => {
            console.log("Failed to load route file", err);
        });
})

const server = async () => {
    try {

        await connect();

        app.listen(port, () => {
            console.log(`server is running on ${port}`);
        })
    } catch (error) {
        console.log('failde to start');
        process.exit(1)
    }
}

server();