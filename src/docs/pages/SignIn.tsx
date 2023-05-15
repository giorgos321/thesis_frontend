import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { actionsEnum } from '../../appReducer';
import { AppContext } from '../Root';

type Props = {};

const SingIn = ({}: Props) => {
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
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign In
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  onChange={(e) => (_email.current = e.target.value)}
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username"
                  required={true}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  onChange={(e) => (_password.current = e.target.value)}
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required={true}
                />
              </div>
              <button
                onClick={submit}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
