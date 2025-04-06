import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Root } from "./app/Root";
import "./index.css";
import { Flowbite } from "./lib/components";

// Initialize theme from localStorage before rendering
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // If no theme preference is stored, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      // Use default theme from environment or fall back to light
      const defaultTheme = import.meta.env.VITE_DEFAULT_THEME || 'light';
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', defaultTheme);
    }
  }
};

// Run initialization before rendering
initializeTheme();

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  const theme = {
    sidebar: {
      base: "h-full bg-inherit",
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded bg-inherit py-4 px-3",
    },
  };

  root.render(
    <Flowbite theme={{ theme }}>
      <BrowserRouter basename="/thesis_frontend">
        <Root />
      </BrowserRouter>
    </Flowbite>
  );
}
