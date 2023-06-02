import type { ComponentProps, FC, ReactNode } from "react";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GoSignIn } from "react-icons/go";
import { HiHome, HiUserAdd } from "react-icons/hi";
import { ImLab } from "react-icons/im";
import Home from "./pages/Home";
import Labs from "./pages/Labs";
import SingIn from "./pages/SignIn";
import SingUp from "./pages/SingUp";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";

export type ComponentCardItem = {
  className: string;
  images: { light: string; dark: string };
};

export type RouteProps = {
  title: string;
  icon: FC<ComponentProps<"svg">>;
  href: string;
  component: ReactNode;
  protected: boolean;
  group: boolean;
  card?: ComponentCardItem;
};

export const bottomRoutes: RouteProps[] = [
  {
    title: "Σύνδεση",
    icon: GoSignIn,
    href: "/signin",
    component: <SingIn />,
    group: false,
    protected: false,
  },
  {
    title: "Εγγραφή",
    icon: HiUserAdd,
    href: "/signup",
    component: <SingUp />,
    group: false,
    protected: false,
  },
];

export const routes: RouteProps[] = [
  {
    title: "Αρχική",
    icon: HiHome,
    href: "/",
    component: <Home />,
    group: false,
    protected: false,
  },
  {
    title: "Εργαστίρια",
    icon: ImLab,
    href: "/labs",
    component: <Labs />,
    group: false,
    protected: true,
  },
  {
    title: "Καθηγητές",
    icon: FaChalkboardTeacher,
    href: "/teachers",
    component: <Teachers />,
    group: false,
    protected: true,
  },
  {
    title: "Φοιτητές",
    icon: BsFillPersonBadgeFill,
    href: "/students",
    component: <Students />,
    group: false,
    protected: true,
  },
];
