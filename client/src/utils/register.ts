import axios from "axios";

/**
 * User Login interface representing the structure of user login data.
 */
export interface IUserRegister {
  email: string;
  username: string;
  password: string;
}

const register = async (data: IUserRegister) => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/register`,
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

export default register;
