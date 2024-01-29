import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import express from "express";
import { isAuthenticated, isOwner } from "../middlewares/index";

/**
 * Sets up user routes.
 *
 * @param {express.Router} router - The express router to attach the routes to.
 */
/**
 * Attaches user-related routes to the provided express router.
 *
 * @param {express.Router} router - The express router instance to which the user routes will be attached.
 */
export default (router: express.Router) => {
  /**
   * GET route for retrieving all users.
   * This route will invoke middleware to ensure the request is authenticated before proceeding to retrieve all users.
   *
   * @name getAllUsers
   * @path {GET} /users
   * @auth This route requires authentication. If authentication fails, it will return a 403 Forbidden response.
   * @response {Object[]} users - The list of all user records from the database.
   */
  router.get("/users", isAuthenticated, getAllUsers);

  /**
   * DELETE route for deleting a user.
   * This route will invoke middleware to ensure the request is authenticated before proceeding to delete the user.
   *
   * @name deleteUser
   * @path {DELETE} /users/:id
   * @auth This route requires authentication. If authentication fails, it will return a 403 Forbidden response.
   * @param {string} id - The ID of the user to delete.
   * @response {Object} user - The deleted user record from the database.
   */
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);

  /**
   * PATCH route for updating a user.
   * This route will invoke middleware to ensure the request is authenticated and the requester is the owner before proceeding to update the user.
   *
   * @name updateUser
   * @path {PATCH} /users/:id
   * @auth This route requires authentication and ownership. If either fails, it will return a 403 Forbidden response.
   * @param {string} id - The ID of the user to update.
   * @response {Object} user - The updated user record from the database.
   */
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
