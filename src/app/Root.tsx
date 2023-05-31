import type { FC } from "react";
import {
  createContext,
  Suspense,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
// import { BsGithub } from 'react-icons/bs';
import { GoSignOut } from "react-icons/go";
import { HiCheck, HiExclamation, HiMenuAlt1, HiX } from "react-icons/hi";
// import { SiStorybook } from 'react-icons/si';
import { Draggable } from "@fullcalendar/interaction";
import { DarkThemeToggle, Navbar, Sidebar, Spinner } from "flowbite-react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api, { apiParams } from "../api";
import type { actions, appState } from "../appReducer";
import { actionsEnum, appReducer } from "../appReducer";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import { Toast } from "../lib";
import RootUtils from "./RootUtils";
import { bottomRoutes as _bottomRoutes, routes as _routes } from "./routes";

interface Lab {
  id?: number;
  lab_name: string;
  lab_description: string;
  createdAt?: string;
  updatedAt?: string;
}

const defaultState = {
  auth: false,
  toast: { show: false },
};

export const AppContext = createContext<{
  state: appState;
  dispatch: React.Dispatch<actions>;
}>({
  state: defaultState,
  dispatch: () => undefined,
});

export const Root: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  const [state, dispatch] = useReducer(appReducer, defaultState);
  const [labs, setLabs] = useState<Lab[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (typeof token === "string" && token.length > 0) {
      dispatch({ type: actionsEnum.auth, payload: { auth: true } });
    }
  }, []);

  const getLabs = async () => {
    const { data } = await api.get<Lab[]>("api/labs");
    setLabs(data);
  };

  const routes = _routes.filter((r) => {
    if (state.auth) {
      return true;
    }
    return !r.protected;
  });

  const bottomRoutes = _bottomRoutes.filter(() => !state.auth);

  const logout = () => {
    if (apiParams.authInterceptorId) {
      api.interceptors.request.eject(apiParams.authInterceptorId);
    }
    localStorage.removeItem("token");
    navigate("/signin");
  };

  useDidUpdateEffect(() => {
    if (!state.auth) {
      logout();
      setLabs([]);
    } else {
      getLabs();
    }
  }, [state.auth]);

  useEffect(() => {
    for (const event of labs) {
      const el = document.getElementById(`draggable-${event.id}`);
      if (el) {
        new Draggable(el);
      }
    }
  }, [labs]);

  const getToastIcon = (type: "success" | "error" | "warning") => {
    switch (type) {
      case "error":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiX className="h-5 w-5" />
          </div>
        );
      case "success":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiCheck className="h-5 w-5" />
          </div>
        );
      case "warning":
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            <HiExclamation className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Navbar fluid>
        <div className="flex items-center">
          <HiMenuAlt1
            className="mr-6 h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-400"
            onClick={() => setCollapsed(!collapsed)}
          />
          <span className="text-xl font-semibold dark:text-white">
            AbsenceMonitor
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* <a
            className="cursor-pointer rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            href={`${process.env.PUBLIC_URL}/storybook`}
            title="Storybook"
            target="_blank"
            rel="noreferrer"
          >
            <SiStorybook className="h-5 w-5" />
          </a> */}
          {/* <a
            className="cursor-pointer rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            href="https://github.com/themesberg/flowbite-react"
            title="Github Repository"
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub className="h-5 w-5" />
          </a> */}
          <DarkThemeToggle />
        </div>
      </Navbar>
      <AppContext.Provider value={{ state, dispatch }}>
        <div className="flex h-full overflow-hidden bg-white dark:bg-gray-900">
          <Sidebar
            collapsed={collapsed}
            className="h-full border-r-2 border-gray-200"
          >
            <Sidebar.Items className="h-full">
              <div className=" flex h-full flex-col">
                <div className="grow">
                  <Sidebar.ItemGroup>
                    {routes.map(({ href, icon, title }, key) => (
                      <Sidebar.Item
                        key={key}
                        icon={icon}
                        as={Link}
                        to={href}
                        active={href === pathname}
                        onClick={() => mainRef.current?.scrollTo({ top: 0 })}
                      >
                        {title}
                      </Sidebar.Item>
                    ))}
                  </Sidebar.ItemGroup>
                  <Sidebar.ItemGroup>
                    <div className="flex flex-col gap-1">
                      {labs.map((lab) => {
                        const event = {
                          title: lab.lab_name,
                          duration: "02:00",
                        };

                        return (
                          <div
                            key={lab.id}
                            id={`draggable-${lab.id}`}
                            data-event={`${JSON.stringify(event)}`}
                            className=" cursor-pointer rounded bg-blue-500 p-2 text-white"
                          >
                            {lab.lab_name}
                          </div>
                        );
                      })}
                    </div>
                  </Sidebar.ItemGroup>
                </div>
                <Sidebar.ItemGroup>
                  {state.auth && (
                    <Sidebar.Item
                      as={Link}
                      to={"/signin"}
                      icon={GoSignOut}
                      onClick={() =>
                        dispatch({
                          type: actionsEnum.auth,
                          payload: { auth: false },
                        })
                      }
                    >
                      Log Out
                    </Sidebar.Item>
                  )}
                  {bottomRoutes.map(({ href, icon, title }, key) => (
                    <Sidebar.Item
                      key={key}
                      icon={icon}
                      as={Link}
                      to={href}
                      active={href === pathname}
                      onClick={() => mainRef.current?.scrollTo({ top: 0 })}
                    >
                      {title}
                    </Sidebar.Item>
                  ))}
                </Sidebar.ItemGroup>
              </div>
            </Sidebar.Items>
          </Sidebar>
          <main
            className="flex-1 overflow-auto bg-white p-4 dark:bg-gray-900"
            ref={mainRef}
          >
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <RootUtils>
                <Routes>
                  {[...routes, ...bottomRoutes].map(
                    ({ href, component: Component }) => (
                      <Route key={href} path={href} element={Component} />
                    )
                  )}
                </Routes>
                <div className="fixed bottom-3 right-8">
                  <Toast>
                    {typeof state.toast.toastType === "string" &&
                      getToastIcon(state.toast.toastType)}
                    <div className="ml-3 text-sm font-normal">
                      {state.toast.message}
                    </div>
                    <Toast.Toggle />
                  </Toast>
                </div>
              </RootUtils>
            </Suspense>
          </main>
        </div>
      </AppContext.Provider>
    </div>
  );
};
