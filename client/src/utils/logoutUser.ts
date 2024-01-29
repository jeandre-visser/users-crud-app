import axios from "axios";

const logoutUser = async () => {
  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export default logoutUser;
