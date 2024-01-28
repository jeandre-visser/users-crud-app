import { MdDelete } from "react-icons/md";
import style from "./users-table.module.scss";
import fetchUsers, { IUser } from "../../utils/fetchUsers";
import { useQuery } from "@tanstack/react-query";

const UsersTableComponent = () => {
  const fetchAllUsers = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (fetchAllUsers.isLoading) return <div>Loading Users...</div>;

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
              {" "}
              <button type="button">
                <MdDelete color="red" />
              </button>
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
