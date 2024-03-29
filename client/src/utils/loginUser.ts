import axios from "axios";

/**
 * User Login interface representing the structure of user login data.
 */
export interface IUserLogin {
  email: string;
  password: string;
}

const loginUser = async (data: IUserLogin) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/login`,
    data,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default loginUser;
