import { useState } from "react";
import style from "./navbar.module.scss";
import LoginComponent from "../login/login.component";
import RegisterComponent from "../register/register.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import logoutUser from "../../utils/logoutUser";
import { isAxiosError } from "axios";

const Navbar = () => {
  /** Initialize the query client from react-query. */
  const queryClient = useQueryClient();
  /** State to manage the visibility of the login modal */
  const [loginModal, setLoginModal] = useState(false);
  /** State to manage the visibility of the register modal */
  const [registerModal, setRegisterModal] = useState(false);
  /** State to store the current logged in user */
  const [currentUser, setCurrentUser] = useState<string | null>(
    localStorage.getItem("username") || ""
  );

  /** Mutation for logging out a user */
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      /** Set current user to null upon successful logout */
      setCurrentUser(null);
      /** Invalidate the 'users' query to refresh the user data */
      queryClient.invalidateQueries({ queryKey: ["users"] });
      /** Clear the username from local storage upon successful logout */
      localStorage.removeItem("username");
    },
    onError: (error: unknown) => {
      /** Handle errors during logout, showing appropriate messages */
      if (isAxiosError(error) && error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to logout user");
      }
    },
  });

  /** Function to handle user logout */
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  /** Function to open the login modal and close the register modal */
  const openLoginModal = () => {
    setLoginModal(true);
    setRegisterModal(false);
  };

  /** Function to open the register modal and close the login modal */
  const openRegisterModal = () => {
    setLoginModal(false);
    setRegisterModal(true);
  };
  return (
    <nav className={style.navbar}>
      <div className={style.title}>USERS CRUD APP</div>
      <div className={style.buttons}>
        {currentUser ? (
          <>
            <span>Welcome, {currentUser}!</span>
            <button onClick={handleLogout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={openLoginModal} type="button">
              Login
            </button>
            <button onClick={openRegisterModal} type="button">
              Register
            </button>
          </>
        )}
      </div>
      <LoginComponent
        loginModal={loginModal}
        setLoginModal={setLoginModal}
        setCurrentUser={setCurrentUser}
      />
      <RegisterComponent
        registerModal={registerModal}
        setRegisterModal={setRegisterModal}
        setCurrentUser={setCurrentUser}
      />
    </nav>
  );
};

export default Navbar;
