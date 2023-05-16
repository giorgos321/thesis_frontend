import { useRef } from 'react';
import api from '../../api';

const SingUp = () => {
  const _username = useRef<string>();

  const _email = useRef<string>();

  const _password = useRef<string>();

  const _confirmPassword = useRef<string>();

  const submit = async () => {
    const email = _email.current;
    const username = _username.current;
    const password = _password.current;
    const confirmPassword = _confirmPassword.current;

    if (password === confirmPassword) {
      const res = await api.post('api/auth/signup', {
        username,
        email,
        password,
        roles: ['admin'],
      });
      console.log(res);
    }
  };

  return (
    <section className="h-full">
      <div className="flex h-full flex-col items-center justify-center">
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create and account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
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
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
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
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
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
              {/* <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required={true} />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                                </div>
                            </div> */}
              <button
                onClick={submit}
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              {/* <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                            </p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingUp;
