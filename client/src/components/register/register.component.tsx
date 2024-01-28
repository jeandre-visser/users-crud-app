import style from "../login/login.module.scss";

interface IRegisterProps {
  registerModal: boolean;
  setRegisterModal: (value: boolean) => void;
}

const RegisterComponent = (props: IRegisterProps) => {
  return (
    <dialog open={props.registerModal} className={style.login}>
      <div className={style.title}>Register</div>
      <div className={style.input_container}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
      </div>
      <div className={style.input_container}>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" />
      </div>
      <div className={style.input_container}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" />
      </div>
      <div className={style.buttons}>
        <button
          onClick={() => {
            props.setRegisterModal(false);
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

export default RegisterComponent;
