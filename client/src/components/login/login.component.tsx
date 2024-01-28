import style from "./login.module.scss";

interface ILoginProps {
  loginModal: boolean;
  setLoginModal: (value: boolean) => void;
}

const LoginComponent = (props: ILoginProps) => {
  return (
    <dialog open={props.loginModal} className={style.login}>
      <div className={style.title}>Login</div>
      <div className={style.input_container}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
      </div>
      <div className={style.input_container}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
      </div>
      <div className={style.buttons}>
        <button
          onClick={() => {
            props.setLoginModal(false);
          }}
          type="button"
        >
          Cancel
        </button>
        <button>Login</button>
      </div>
    </dialog>
  );
};

export default LoginComponent;
