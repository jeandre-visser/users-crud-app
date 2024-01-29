import { MdDelete } from "react-icons/md";
import style from "./users-table.module.scss";
import fetchUsers, { IUser } from "../../utils/fetchUsers";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BiEditAlt } from "react-icons/bi";

const UsersTableComponent = () => {
  const loggedInUsername = localStorage.getItem("username");
  /**
   * Fetch all users using react-query.
   * The query key is an array with a single element "users".
   * The query function is fetchUsers.
   */
  const fetchAllUsers = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    retry: 2,
  });

  /**
   * If the query is still loading, return a loading message.
   */
  if (fetchAllUsers.isFetching) return <div>Loading Users...</div>;

  /**
   * If the query encounters an error, check if it's a 403 error.
   * If it is, return a message indicating that the user must be logged in.
   */
  if (fetchAllUsers.isError) {
    if ((fetchAllUsers.error as AxiosError)?.response?.status === 403) {
      return (
        <div className={style.error}>You must be logged in to view users</div>
      );
    } else {
      return (
        <div className={style.error}>There was an error loading users</div>
      );
    }
  }

  return (
    <table className={style.users_table}>
      <thead>
        <tr>
          <th>Actions</th>
          <th>Email</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        {fetchAllUsers.data?.map((user: IUser, index: number) => (
          <tr key={index}>
            <td>
              {loggedInUsername === user.username && (
                <button type="button">
                  <MdDelete color="red" />
                </button>
              )}
              {loggedInUsername === user.username && (
                <button type="button">
                  <BiEditAlt color="#007bff" />
                </button>
              )}
            </td>
            <td>{user.email}</td>
            <td>{user.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTableComponent;
