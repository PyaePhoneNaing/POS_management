import { useState, useEffect } from "react";
import { useSidebar } from "../Context/SidebarContext"; // Import the SidebarContext hook
import "../Styles/Header.styles.scss";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

export default function Header({ pageTitle }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme to localStorage
  };

  return (
    <div className="header px-3 py-2 d-flex align-items-center border-bottom shadow-sm">
      {/* Hamburger Menu */}
      <button
        className="btn btn-light d-lg-none me-3"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      <div className="d-flex align-items-center me-auto">
        {pageTitle && (
          <h3 className="mb-0 ms-2" style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--sidebar-text-color, #222)' }}>{pageTitle}</h3>
        )}
      </div>
      <div className="d-flex align-items-center gap-3">
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className="btn  p-2 rounded-circle"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <i className="bi bi-sun "></i>
          ) : (
            <i className="bi bi-moon "></i>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-light d-flex align-items-center p-2 dropdown-toggle"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <svg
              className="rounded-circle me-2"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#6c757d" />
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#fff"
              />
            </svg>
            <span className="d-none d-lg-inline fw-semibold">
              Admin
            </span>
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end shadow"
            aria-labelledby="profileDropdown"
          >
            {userNavigation.map((item) => (
              <li key={item.name}>
                <a className="dropdown-item" href={item.href}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}