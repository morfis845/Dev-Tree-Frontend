import { Link, Outlet } from "react-router-dom";
import NavigationTabs from "./NavigationsTabs";
import type { SocialLink, User } from "@/types";
import { Icon } from "../../public/SocialIcons/Icon";
import type { IconName } from "../../public/SocialIcons/icons";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect, useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateUser } from "@/api/DevTreeApi";
import { toast } from "sonner";

type DevTreeProps = {
  data: User;
};

export default function DevTree({ data }: DevTreeProps) {
  const [enabledLinks, setEnabledLinks] = useState<SocialLink[]>([]);
  const draggedRef = useRef(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      toast.error("Error al guardar el orden", { id: "reorder-error" });
      console.error(error);
    },
    onSuccess: (response) => {
      toast.success("Orden guardado", { id: "reorder-success" });
      if (response.user) {
        queryClient.setQueryData(["getUser"], response.user);
      }
    },
  });

  // Sincroniza enabledLinks cuando data.links cambia
  useEffect(() => {
    const links = JSON.parse(data.links).filter(
      (link: SocialLink) => link.enabled
    );
    setEnabledLinks(links);
  }, [data.links]);

  const linkIds = enabledLinks.map((link: SocialLink) => link.id);
  const allLinks: SocialLink[] = JSON.parse(data.links);

  const handelDragEnd = (event: DragEndEvent) => {
    if (!event.over || !event.over.id) return;

    const prevIndex = linkIds.indexOf(event.active.id as number);
    const newIndex = linkIds.indexOf(event.over.id as number);

    if (prevIndex === -1 || newIndex === -1) return;

    // Reordena solo los links habilitados
    const reorderedEnabled = arrayMove(enabledLinks, prevIndex, newIndex);
    setEnabledLinks(reorderedEnabled);

    // Crea el nuevo arreglo: habilitados en nuevo orden + deshabilitados al final
    const disabledLinks = allLinks.filter((link) => !link.enabled);
    const reorderedLinks = [...reorderedEnabled, ...disabledLinks];

    console.log("Links reordenados:", reorderedLinks);

    // Actualiza React Query inmediatamente
    const linksString = JSON.stringify(reorderedLinks);
    queryClient.setQueryData(["getUser"], (oldData: User | undefined) =>
      oldData
        ? {
            ...oldData,
            links: linksString,
          }
        : oldData
    );

    // Guarda en la base de datos
    mutate({
      ...data,
      links: linksString,
    });
  };

  return (
    <>
      <header className="bg-slate-800 py-5">
        <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center md:justify-between md:px-5">
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
        <main className="mx-auto max-w-5xl p-10">
          <NavigationTabs />
          <div className="flex justify-end">
            <Link
              className="font-bold text-right text-slate-800 text-2xl"
              to={`/${data.handle}`}
            >
              Visitar Mi Perfil: {data.handle}
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-10 mt-10">
            <div className="flex-1 ">
              <Outlet />
            </div>
            <div className="w-full md:w-96 bg-slate-800 py-10 space-y-6">
              <p className="text-4xl text-center text-white">{data.handle}</p>
              {data.image && (
                <img
                  src={data.image}
                  alt="imagen de perfil"
                  className="w-full h-64 object-cover overflow-hidden mask-b-from-70% mask-b-to-100%"
                />
              )}
              <p className="justify-center text-lg font-black text-white flex">
                {data.description}
              </p>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handelDragEnd}
              >
                <SortableContext
                  items={linkIds}
                  strategy={verticalListSortingStrategy}
                >
                  {enabledLinks.map((link: SocialLink) => (
                    <SortableLink key={link.id} link={link} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function SortableLink({ link }: { link: SocialLink }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <a
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      href={link.url}
      target="_blank"
      className="bg-gray-700 p-3 hover:bg-gray-600 rounded-lg flex items-center gap-4 group text-white font-bold text-xl mx-10 cursor-grab active:cursor-grabbing"
    >
      {/* Icono: ancho fijo */}
      <span className="w-8 h-8 flex items-center justify-center">
        <Icon
          name={link.name as IconName}
          className="group-hover:scale-110 transition-transform"
          size={24}
          color="#ffffff"
        />
      </span>

      {/* Texto */}
      <span className="group-hover:underline">{link.name}</span>
    </a>
  );
}
