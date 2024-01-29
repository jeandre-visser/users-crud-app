import { createUser, getUserByEmail, getUserBySessionToken } from "../db/users";
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

    // Generate session token
    const sessionSalt = random();
    user.authentication.sessionToken = authentication(
      sessionSalt,
      user._id.toString()
    );

    // Save session token
    await user.save();

    // Set cookie with session token
    res.cookie("AUTH_TOKEN", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Respond with the created user object
    return res.status(200).json(user);
  } catch (err) {
    // Log and respond with error
    console.error("Unable to create user:", err);
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
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Respond with the user object
    return res.status(200).json(user);
  } catch (err) {
    // Log and respond with error
    console.error("Unable to login user:", err.message);
    return res.status(400).send("Unable to login user");
  }
};

/**
 * Handles the logout of a user.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<express.Response>} A promise that resolves to the response object.
 */
export const logout = async (req: express.Request, res: express.Response) => {
  try {
    // Retrieve the session token from the cookie
    const sessionToken = req.cookies["AUTH_TOKEN"];

    // Check if the session token is provided
    if (!sessionToken) {
      return res.status(400).send("No session token provided");
    }

    // Retrieve user by session token
    const user = await getUserBySessionToken(sessionToken);

    // Check if user exists
    if (!user) {
      return res.status(400).send("Invalid session token");
    }

    // Clear the session token
    user.authentication.sessionToken = null;

    // Save the user object
    await user.save();

    // Clear the cookie with the session token
    res.clearCookie("AUTH_TOKEN", {
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Respond with success message
    return res.status(200).send("Successfully logged out");
  } catch (err) {
    // Log and respond with error
    console.error("Unable to logout user:", err.message);
    return res.status(400).send("Unable to logout user");
  }
};
