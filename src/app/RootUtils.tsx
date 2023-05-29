import { AxiosError } from "axios";
import { FC, PropsWithChildren, useContext, useEffect } from "react";
import api from "../api";
import { actionsEnum } from "../appReducer";
import useToast from "../hooks/useToast";
import { AppContext } from "./Root";

const RootUtils: FC<PropsWithChildren> = ({ children }) => {
  const { showToast } = useToast();

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message: string }>) => {
        const { response } = error;

        if (response) {
          showToast("error", response.data.message, 5000);
        } else {
          showToast("error", "Υπήρξε κάποιο πρόβλημα", 5000);
        }

        // You can show a custom error message here
        console.error(
          "Failed request message:",
          "An error occurred during the request."
        );
        dispatch({ type: actionsEnum.auth, payload: { auth: false } });
        return Promise.reject(error);
      }
    );
  }, []);

  return <>{children}</>;
};

export default RootUtils;
