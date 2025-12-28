import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function AdminNavigation() {
  const queryClient = useQueryClient();
  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    queryClient.clear();
  };
  return (
    <Link to="/">
      <button
        className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
        onClick={logout}
      >
        Cerrar Sesión
      </button>
    </Link>
  );
}
