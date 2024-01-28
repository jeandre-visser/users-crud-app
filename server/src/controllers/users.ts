import { deleteUserById, getUserById, getUsers } from "../db/users";
import express from "express";

/**
 * Retrieves all users from the database.
 */
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  /**
   * Tries to retrieve all users from the database and send them in the response.
   * If an error occurs, logs the error and sends 400 status code with an error message.
   *
   * @returns {Promise<express.Response>} The express response object with the users or an error message.
   */
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to get all users");
  }
};

/**
 * Deletes a user from the database by their ID.
 */
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  /**
   * Tries to delete a user by their ID from the database and send the deleted user in the response.
   * If an error occurs, the catch block will handle the error by logging it and sending a 400 status code with an error message.
   */
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res
      .status(200)
      .json(deletedUser)
      .send("Successfully delete the user");
  } catch (error) {
    console.error(error);
    return res.status(400).send("Unable to delete user");
  }
};
/**
 * Updates a user's information in the database.
 */
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  /**
   * Tries to update a user's username in the database.
   * If an error occurs, logs the error and sends a 400 status code with an error message.
   *
   * @param {string} username - The new username for the user.
   * @param {string} id - The ID of the user to update.
   *
   * @returns {Promise<express.Response>} The express response object with a success message or an error message.
   */
  try {
    const { username } = req.body;
    const { id } = req.params;

    if (!username) {
      return res.status(400).send("Missing username");
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.status(200).json({ user, message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).send("Unable to update user");
  }
};
