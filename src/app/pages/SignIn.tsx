import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { actionsEnum } from '../../appReducer';
import { AppContext } from '../Root';

const SingIn = () => {
  const _email = useRef('');

  const _password = useRef('');
  const navigate = useNavigate();

  const { dispatch } = useContext(AppContext);

  const submit = async () => {
    const email = _email.current;
    const password = _password.current;

    const res = await api.post('api/auth/signin', {
      email,
      password,
    });

    if (res.status === 200) {
      localStorage.setItem('token', res.data.accessToken);
    }

    api.interceptors.request.use(
      (config) => {
        if (config.headers) {
          config.headers['x-access-token'] = res.data.accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    dispatch({ type: actionsEnum.auth, payload: { auth: true } });
    navigate('/');
  };

  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign In
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  onChange={(e) => (_email.current = e.target.value)}
                  id="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  placeholder="username"
                  required={true}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  onChange={(e) => (_password.current = e.target.value)}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:text-sm"
                  required={true}
                />
              </div>
              <button
                onClick={submit}
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingIn;
