import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import dotenv from "dotenv";
dotenv.config();

/**
 * Initializes the express application and sets up middleware, server, and database connection.
 */
const app = express();

/**
 * Middleware to enable CORS with credentials.
 */
app.use(
  cors({
    credentials: true,
  })
);

/**
 * Middleware to parse JSON request bodies.
 */
app.use(bodyParser.json());

/**
 * Middleware to compress response bodies.
 */
app.use(compression());

/**
 * Middleware to parse cookies from the HTTP Request.
 */
app.use(cookieParser());

/**
 * Creates an HTTP server for the express app.
 */
const server = http.createServer(app);

/**
 * Starts the server on port 8080 and logs the running status.
 */
server.listen(8080, () => {
  console.log("Server is running on port http://localhost:8080/");
});

/**
 * MongoDB connection URL.
 */
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/test";

/**
 * Sets mongoose's Promise to global Promise.
 */
mongoose.Promise = Promise;

/**
 * Connects to MongoDB using the connection URL.
 */
mongoose.connect(MONGO_URL);

/**
 * Event listener for MongoDB connection error.
 */
mongoose.connection.on("error", (err: Error) => {
  console.error(err);
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
});

/**
 * Adds the main router to the express application.
 */
app.use("/", router());
