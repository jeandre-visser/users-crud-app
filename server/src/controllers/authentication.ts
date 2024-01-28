import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { authentication, random } from "../helpers/index";
/**
 * Handles the registration of a new user.
 * @param {express.Request} req - The request object containing user details.
 * @param {express.Response} res - The response object.
 * @returns {Promise<express.Response>} A promise that resolves to the response object.
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    // Validate request body for required fields
    if (!email || !password || !username) {
      return res
        .status(400)
        .send("Missing email, password, or username for register");
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Create a new user with hashed password and salt
    const salt = random();
    const hashedPassword = authentication(salt, password);
    const user = await createUser({
      email,
      username,
      authentication: {
        password: hashedPassword,
        salt: salt,
      },
    });

    // Respond with the created user object
    return res.status(200).json(user);
  } catch (err) {
    // Log and respond with error
    console.error("Unable to create user:", err.message);
    return res.status(400).send("Unable to create user");
  }
};

/**
 * Handles the login of a user.
 * @param {express.Request} req - The request object containing user details.
 * @param {express.Response} res - The response object.
 * @returns {Promise<express.Response>} A promise that resolves to the response object.
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Validate request body for required fields
    if (!email || !password) {
      return res.status(400).send("Missing email or password for login");
    }

    // Retrieve user by email
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    // Check if user exists
    if (!user) {
      return res.status(400).send("User does not exist");
    }

    // Authenticate user
    const expectedHash = authentication(user.authentication.salt, password);

    // Check if password is correct
    if (expectedHash !== user.authentication.password) {
      return res.status(403).send("Incorrect password");
    }

    // Generate session token
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    // Save session token
    await user.save();

    // Set cookie with session token
    res.cookie("AUTH_TOKEN", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    // Respond with the user object
    return res.status(200).json(user);
  } catch (err) {
    // Log and respond with error
    console.error("Unable to login user:", err.message);
    return res.status(400).send("Unable to login user");
  }
};
