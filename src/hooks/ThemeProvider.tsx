import { FC, ReactNode, useEffect } from "react";
import useTheme from "./useTheme";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  // Initialize theme when the application starts
  useEffect(() => {
    // This effect will run once on mount and whenever theme changes
    // The theme is already managed by the useTheme hook
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
