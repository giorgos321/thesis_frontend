import classNames from "classnames";
import {
  ComponentProps,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { AppContext } from "../../../app/Root";
import useDidUpdateEffect from "../../../hooks/useDidUpdateEffect";
import { excludeClassName } from "../../helpers/exclude";
import { useTheme } from "../Flowbite/ThemeContext";
import type { Duration } from "./ToastContext";
import { ToastContext } from "./ToastContext";
import { ToastToggle } from "./ToastToggle";

export interface ToastProps
  extends PropsWithChildren<Omit<ComponentProps<"div">, "className">> {
  duration?: Duration;
}

const durationClasses: Record<Duration, string> = {
  75: "duration-75",
  100: "duration-100",
  150: "duration-150",
  200: "duration-200",
  300: "duration-300",
  500: "duration-500",
  700: "duration-700",
  1000: "duration-1000",
};

const ToastComponent: FC<ToastProps> = ({
  children,
  duration = 700,
  ...props
}) => {
  const [isClosed, setIsClosed] = useState(true);
  const [isRemoved, setIsRemoved] = useState(true);
  const { state } = useContext(AppContext);

  useDidUpdateEffect(() => {
    const show = state.toast.show;
    console.log(show);

    setIsClosed(!show);

    if (!show) {
      setTimeout(() => setIsRemoved(!show), duration);
    } else {
      setIsRemoved(!show);
    }
  }, [state.toast.show]);

  const theme = useTheme().theme.toast;
  const theirProps = excludeClassName(props);

  return (
    <ToastContext.Provider
      value={{ duration, isClosed, isRemoved, setIsClosed, setIsRemoved }}
    >
      <div
        data-testid="flowbite-toast"
        className={classNames(
          theme.base,
          durationClasses[duration],
          { [theme.closed]: isClosed },
          { [theme.removed]: isRemoved }
        )}
        {...theirProps}
      >
        {children}
      </div>
    </ToastContext.Provider>
  );
};

ToastComponent.displayName = "Toast";
ToastToggle.displayName = "Toast.Toggle";

export const Toast = Object.assign(ToastComponent, {
  Toggle: ToastToggle,
});
