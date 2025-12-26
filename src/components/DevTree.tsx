import { Link, Outlet } from "react-router-dom";
import NavigationTabs from "./NavigationsTabs";
import { Toaster } from "sonner";
import type { SocialLink, User } from "@/types";
import { Icon } from "../../public/SocialIcons/Icon";
import type { IconName } from "../../public/SocialIcons/icons";

type DevTreeProps = {
  data: User;
};

export default function DevTree({ data }: DevTreeProps) {
  return (
    <>
      <header className="bg-slate-800 py-5">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between">
          <div className="w-full p-5 lg:p-0 md:w-1/3">
            <img src="/logo.svg" className="w-full block" />
          </div>
          <div className="md:w-1/3 md:flex md:justify-end">
            <button
              className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
              onClick={() => {}}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <div className="bg-gray-100  min-h-screen py-10">
        <main className="mx-auto max-w-5xl p-10 md:p-0">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={"/admin/profile"}
            >
              Visitar Mi Perfil: {data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
              <p className="text-4xl text-center text-white">{data.handle}</p>
              {data.image && (
                <img
                  src={data.image}
                  alt="imagen de perfil"
                  className="mx-auto max-w-62.5"
                />
              )}
              <p className="justify-center text-lg font-black text-white flex">
                {data.description}
              </p>
              {JSON.parse(data.links).map(
                (link: SocialLink) =>
                  link.enabled && (
                    <div key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        className="bg-gray-700 p-3 hover:bg-gray-600 roundede-lg flex items-center gap-4 group text-white font-bold text-xl"
                      >
                        {/* Icono: ancho fijo */}
                        <span className="w-8 h-8 flex items-center justify-center">
                          <Icon
                            name={link.name as IconName}
                            className="text-white group-hover:scale-110 transition-transform"
                            size={24}
                          />
                        </span>

                        {/* Texto */}
                        <span className="group-hover:underline">
                          {link.name}
                        </span>
                      </a>
                    </div>
                  )
              )}
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </>
  );
}
