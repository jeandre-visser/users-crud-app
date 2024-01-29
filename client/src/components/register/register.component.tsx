import { useMutation, useQueryClient } from "@tanstack/react-query";
import style from "../login/login.module.scss";
import register, { IUserRegister } from "../../utils/register";
import { isAxiosError } from "axios";

interface IRegisterProps {
  registerModal: boolean;
  setRegisterModal: (value: boolean) => void;
  setCurrentUser: (value: string | null) => void;
}

const RegisterComponent = (props: IRegisterProps) => {
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username }: IUserRegister) =>
      register({ email, password, username }),
    onSuccess: (data) => {
      props.setRegisterModal(false);
      props.setCurrentUser(data.username);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      localStorage.setItem("username", data.username);
      alert("Successful registered");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data);
      } else {
        alert("There was an error registering");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    if (email && password && username) {
      registerMutation.mutate({
        email,
        username,
        password,
      });
    }
  };

  return (
    <dialog open={props.registerModal} className={style.login}>
      <form className={style.login} onSubmit={handleSubmit}>
        <div className={style.title}>Register</div>
        <div className={style.input_container}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div className={style.input_container}>
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" />
        </div>
        <div className={style.input_container}>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
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
          <button type="submit">
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default RegisterComponent;
