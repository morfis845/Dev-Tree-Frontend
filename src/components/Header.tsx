import AdminNavigation from "./nav/AdminNavigation";
import { Link, useLocation } from "react-router-dom";
import HomeNavigation from "./nav/HomeNavigation";

export default function Header() {
  const location = useLocation();
  return (
    <header className="bg-slate-800 py-5">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between md:px-5">
        <div className="w-full p-5 lg:p-0 md:w-1/3">
          <Link to="/">
            <img src="/logo.svg" className="w-full block" />
          </Link>
        </div>
        <nav className="md:w-1/3 md:flex md:justify-end">
          {}
          {location.pathname.includes("/admin") ? (
            <AdminNavigation />
          ) : (
            <HomeNavigation />
          )}
        </nav>
      </div>
    </header>
  );
}
