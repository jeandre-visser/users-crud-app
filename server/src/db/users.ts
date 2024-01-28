import mongoose from "mongoose";

/**
 * Mongoose schema for User model.
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

/**
 * User model based on the UserSchema.
 */
export const UserModel = mongoose.model("User", UserSchema);

/**
 * Retrieves all users from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of users.
 */
export const getUsers = () => UserModel.find();

/**
 * Retrieves a user by their email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
export const getUserByEmail = (email: string) => UserModel.findOne({ email });

/**
 * Retrieves a user by their session token.
 * @param {string} sessionToken - The session token of the user to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the user object.
 */
export const getUserById = (id: string) => UserModel.findById(id);

/**
 * Creates a new user in the database.
 * @param {Record<string, any>} values - An object containing the values for the new user.
 * @returns {Promise<Object>} A promise that resolves to the created user object.
 */
export const createUser = (values: Record<string, any>): Promise<any> =>
  new UserModel(values).save().then((user) => user.toObject());

/**
 * Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Object>} A promise that resolves to the deleted user object.
 */
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);

/**
 * Updates a user by their ID.
 * @param {string} id - The ID of the user to update.
 * @param {Record<string, any>} values - An object containing the updated values for the user.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 */
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
