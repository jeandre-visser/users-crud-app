import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/users";

/**
 * Middleware to check if a user is authenticated.
 * @param {express.Request} req - The express request object.
 * @param {express.Response} res - The express response object.
 * @param {express.NextFunction} next - The express next function.
 */
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Retrieve session token from cookies
    const sessionToken = req.cookies["AUTH_TOKEN"];

    // If no session token is found, return 403 status
    if (!sessionToken) {
      return res.status(403).send("Forbidden - No session token found");
    }

    // Retrieve user associated with the session token
    const existingUser = await getUserBySessionToken(sessionToken);

    // If no user is found for the session token, return 403 status
    if (!existingUser) {
      return res.status(403).send("No user found for session token");
    }

    // Merge the existing user into the request object
    merge(req, { identity: existingUser });

    // Proceed to the next middleware
    return next();
  } catch (error) {
    // Log the error and return 401 status
    console.error("Unable to authenticate user:", error.message);
    return res.status(401).send("Unable to authenticate user");
  }
};
/**
 * Middleware to check if the current user is the owner of the resource.
 */
export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // Extract the id from request parameters
    const { id } = req.params;

    // Retrieve the current user's id from the request object
    const currentUserId = get(req, "identity._id") as string;

    // If the current user's id is not found, return 403 status
    if (!currentUserId) {
      return res.status(403).send("Forbidden");
    }

    // Check if the current user's id matches the id from the request parameters
    if (currentUserId.toString() !== id) {
      return res.status(403).send("Forbidden - You are not the owner");
    }

    // If the user is the owner, proceed to the next middleware
    next();
  } catch (error) {
    // Log the error and return 401 status
    console.error("Unable to authenticate user:", error.message);
    return res.status(401).send("Unable to authenticate user");
  }
};
