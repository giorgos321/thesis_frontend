import { Button } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { apiParams, authInterceptor } from "../../api";
import { actionsEnum } from "../../appReducer";
import useToast from "../../hooks/useToast";
import { AppContext } from "../Root";

const SingIn = () => {
  const _email = useRef("");

  const _password = useRef("");
  const navigate = useNavigate();

  const { dispatch } = useContext(AppContext);

  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

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
    const password = _password.current;
    try {
      setIsLoading(true);
      const res = await api.post("api/auth/signin", {
        email,
        password,
      });
      setIsLoading(false);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.accessToken);
        apiParams.authInterceptorId = api.interceptors.request.use(
          authInterceptor,
          (error) => {
            return Promise.reject(error);
          }
        );
        dispatch({ type: actionsEnum.auth, payload: { auth: true } });
        navigate("/");
        showToast("success", "User Logged In", 5000);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center dark:bg-gray-900">
        <div className="w-full rounded-lg border-2 border-gray-200  bg-white shadow-2xl sm:max-w-md md:mt-0 xl:p-0 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign In
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  onChange={(e) => (_email.current = e.target.value)}
                  id="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="username"
                  required={true}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  onChange={(e) => (_password.current = e.target.value)}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  required={true}
                />
              </div>
              <Button
                onClick={submit}
                isProcessing={isLoading}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingIn;
