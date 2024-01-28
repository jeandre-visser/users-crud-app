import { login, register } from "../controllers/authentication";
import express from "express";
/**
 * Sets up authentication routes.
 *
 * @param {express.Router} router - The express router to attach the routes to.
 */
export default (router: express.Router) => {
  /**
   * Route for user registration.
   * Accepts user details in the request body and creates a new user.
   */
  router.post("/auth/register", register);

  /**
   * Route for user login.
   * Accepts email and password in the request body and authenticates the user.
   */
  router.post("/auth/login", login);
};
