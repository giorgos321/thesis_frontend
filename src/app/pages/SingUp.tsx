import { Button } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { actionsEnum } from "../../appReducer";
import useToast from "../../hooks/useToast";
import { AppContext } from "../Root";

const SingUp = () => {
  const _username = useRef<string>();

  const _email = useRef<string>();

  const _password = useRef<string>();

  const _confirmPassword = useRef<string>();
  const { dispatch } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { showToast } = useToast();

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter") {
        submit();
      }
    }

    document.addEventListener("keypress", handleKeyPress);

    // Return a cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const submit = async () => {
    const email = _email.current;
    const username = _username.current;
    const password = _password.current;
    const confirmPassword = _confirmPassword.current;

    if (password === confirmPassword) {
      setIsLoading(true);
      try {
        const res = await api.post("api/auth/signup", {
          username,
          email,
          password,
          roles: ["admin"],
        });
        setIsLoading(false);
        if (res.status === 200) {
          localStorage.setItem("token", res.data.accessToken);
          api.interceptors.request.use(
            (config) => {
              if (config.headers) {
                config.headers["x-access-token"] = res.data.accessToken;
              }

              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
          dispatch({ type: actionsEnum.auth, payload: { auth: true } });
          navigate("/");
        }
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      showToast("error", "Οι κωδικοί δεν ταιριάζουν !", 5000);
    }
  };

  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-full rounded-lg border-2 border-gray-200  bg-white shadow-2xl dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create and account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  onChange={(e) => (_username.current = e.target.value)}
                  type="name"
                  name="name"
                  id="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="username"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  onChange={(e) => (_email.current = e.target.value)}
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="youremail@email.com"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  onChange={(e) => (_password.current = e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  required={true}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  onChange={(e) => (_confirmPassword.current = e.target.value)}
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  required={true}
                />
              </div>
              <Button
                isProcessing={isLoading}
                onClick={submit}
                className="w-full"
              >
                Create an account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingUp;
