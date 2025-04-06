import type { FC } from "react";
import React, {
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
import { Navbar, Sidebar, Spinner } from "flowbite-react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import api, { apiParams } from "../api";
import type { actions, appState, User } from "../appReducer";
import { actionsEnum, appReducer, Roles } from "../appReducer";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import ThemeProvider from "../hooks/ThemeProvider";
import DarkThemeToggle from "./components/DarkThemeToggle";
import { Toast } from "../lib";
import Absences from "./pages/Absences";
import RootUtils from "./RootUtils";
import {
  bottomRoutes as _bottomRoutes,
  RouteProps,
  routes as _routes,
} from "./routes";

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
  const [routes, setRoutes] = useState<RouteProps[]>([]);

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

  const getMe = async () => {
    const { data } = await api.get<User>("api/user");
    dispatch({
      type: actionsEnum.currentUser,
      payload: { ...data },
    });
  };

  useEffect(() => {
    const r = _routes.filter((r) => {
      if (!state.currentUser) {
        return !r.protected;
      }
      if (state.currentUser?.role === Roles.admin) {
        return true;
      }
      if (r.role) {
        return r.role === state.currentUser?.role;
      }
      return false;
    });
    setRoutes(r);
  }, [state.currentUser]);

  const bottomRoutes = _bottomRoutes.filter(() => !state.auth);

  const logout = () => {
    if (apiParams.authInterceptorId) {
      api.interceptors.request.eject(apiParams.authInterceptorId);
    }
    localStorage.removeItem("token");
    dispatch({ type: actionsEnum.currentUser, payload: undefined });
    navigate("/signin");
  };

  useDidUpdateEffect(() => {
    if (!state.auth) {
      logout();
      setLabs([]);
    } else {
      getMe();
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
    <ThemeProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <Navbar fluid>
          <div className="flex items-center">
            <HiMenuAlt1
              className="mr-6 h-6 w-6 cursor-pointer text-gray-600 dark:text-gray-400"
              onClick={() => setCollapsed(!collapsed)}
            />
            <span className="text-xl font-semibold dark:text-white">
              Διαχηριστικό απουσιών
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* <a
              className="cursor-pointer rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
              href={`${import.meta.env.BASE_URL}storybook`}
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
                        Αποσύνδεση
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
                    <Route path="/subscriptions/:id" element={<Absences />} />
                    <Route path="*" element={<Navigate to="/" />}></Route>
                  </Routes>
                  <div className="fixed bottom-3 right-8">
                    <Toast style={{ zIndex: 9999 }}>
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
        <Tooltip id={"tooltip"} style={{ zIndex: 99999 }}></Tooltip>
      </div>
    </ThemeProvider>
  );
};
