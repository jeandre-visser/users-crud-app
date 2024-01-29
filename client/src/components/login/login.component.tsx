import { useMutation, useQueryClient } from "@tanstack/react-query";
import style from "./login.module.scss";
import loginUser, { IUserLogin } from "../../utils/loginUser";
import { isAxiosError } from "axios";

interface ILoginProps {
  loginModal: boolean;
  setLoginModal: (value: boolean) => void;
  setCurrentUser: (value: string | null) => void;
}

const LoginComponent = (props: ILoginProps) => {
  /** Initialize the query client from react-query. */
  const queryClient = useQueryClient();

  /**
   * Define the login mutation using react-query's useMutation.
   * The mutation function is loginUser, which takes an object with email and password.
   * On success, it closes the login modal, invalidates the "users" query, and alerts the user.
   */
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: IUserLogin) =>
      loginUser({ email, password }),
    onSuccess: (data) => {
      props.setLoginModal(false);
      props.setCurrentUser(data.username);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      localStorage.setItem("username", data.username);
      alert("Successful logged in");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error) && error.response) {
        alert(error.response.data);
      } else {
        alert("There was an error logging in");
      }
    },
  });

  /**
   * Define the handleSubmit function for the form.
   * It prevents the default form submission, gets the form data, and extracts the email and password.
   * If both email and password are provided, it triggers the login mutation.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email && password) {
      loginMutation.mutate({
        email,
        password,
      });
    }
  };

  return (
    <dialog open={props.loginModal} className={style.login}>
      <form className={style.login} onSubmit={handleSubmit}>
        <div className={style.title}>Login</div>
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
              props.setLoginModal(false);
            }}
            type="button"
          >
            Cancel
          </button>
          <button disabled={loginMutation.isPending} type="submit">
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default LoginComponent;
