import axios from "axios";

/**
 * User Login interface representing the structure of user login data.
 */
export interface IUserLogin {
  username: string;
  email: string;
  password: string;
}

const loginUser = async (data: IUserLogin) => {
  const response = await axios.post(
    `${process.env.VITE_BASE_URL}/auth/login`,
    data
  );
  return response.data;
};

export default loginUser;
