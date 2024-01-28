import { useState } from "react";
import style from "./navbar.module.scss";
import LoginComponent from "../login/login.component";
import RegisterComponent from "../register/register.component";

const Navbar = () => {
  const [loginModal, setLoginModal] = useState(false);
  const [registerModal, setRegisterModal] = useState(false);

  console.log(process.env.VITE_BASE_URL);

  return (
    <nav className={style.navbar}>
      <div className={style.title}>USERS CRUD APP</div>
      <div className={style.buttons}>
        <button
          onClick={() => {
            setLoginModal(true);
          }}
          type="button"
        >
          Login
        </button>
        <button
          onClick={() => {
            setRegisterModal(true);
          }}
          type="button"
        >
          Register
        </button>
      </div>
      <LoginComponent loginModal={loginModal} setLoginModal={setLoginModal} />
      <RegisterComponent
        registerModal={registerModal}
        setRegisterModal={setRegisterModal}
      />
    </nav>
  );
};

export default Navbar;
