import express from "express";
import authentication from "./authentication";
import users from "./users";

// Create a new express router
const router = express.Router();

/**
 * Sets up all routes for the application.
 *
 * @returns {express.Router} The configured router.
 */
export default (): express.Router => {
  // Set up authentication routes
  authentication(router);
  // Set up user routes
  users(router);
  // Return the configured router
  return router;
};
