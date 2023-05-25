import { useContext } from "react";
import { AppContext } from "../app/Root";
import { routes } from "../app/routes";

const useAuthRoutes = () => {
  const ctx = useContext(AppContext);
  const { state } = ctx;
  console.log(state, "hook");

  return routes.filter((r) => {
    if (state.auth) {
      return true;
    }
    return !r.protected;
  });
};

export default useAuthRoutes;
