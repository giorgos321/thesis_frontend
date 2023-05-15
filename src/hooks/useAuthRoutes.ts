import { useContext } from 'react';
import { AppContext } from '../docs/Root';
import { routes } from '../docs/routes';

const useAuthRoutes = () => {
  const ctx = useContext(AppContext);
  const { state } = ctx;
  console.log(state, 'hook');

  return routes.filter((r) => {
    if (state.auth) {
      return true;
    }
    return !r.protected;
  });
};

export default useAuthRoutes;
