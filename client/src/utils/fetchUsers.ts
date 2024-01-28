import axios from "axios";

/**
 * User interface representing the structure of user data.
 */
export interface IUser {
  username: string;
  email: string;
  _id: string;
}

/**
 * Asynchronously fetches the list of users from the server.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
const fetchUsers = async (): Promise<IUser[]> => {
  const response = await axios.get(`${process.env.VITE_BASE_URL}/users`);
  return response.data;
};

export default fetchUsers;
