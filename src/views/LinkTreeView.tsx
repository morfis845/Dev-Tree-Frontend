import DevTreeInput from "@/components/DevTreeInput";
import { social } from "../data/social";
import { useEffect, useState } from "react";
import { isValidUrl } from "@/utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/api/DevTreeApi";
import type { SocialLink, User } from "@/types";

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);
  const [initialLinks, setInitialLinks] = useState(social);

  const queryClient = useQueryClient();
  const data: User = queryClient.getQueryData(["getUser"])!;

  const hasValidUrls = (links: typeof devTreeLinks) => {
    const invalidLink = links.find(
      (link) => link.url !== "" && !isValidUrl(link.url)
    );

    if (invalidLink) {
      toast.error(`La URL de ${invalidLink.name} no es válida.`);
      return false;
    }

    return true;
  };

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (response) => {
      toast.success(response.message ?? "Actualizado correctamente");

      if (response.user) {
        setInitialLinks(JSON.parse(response.user.links));
        queryClient.setQueryData(["getUser"], response.user);
      }
    },
  });

  useEffect(() => {
    const updatedData = devTreeLinks.map((link) => {
      const userLinks = JSON.parse(data.links);
      const userLink = userLinks.find(
        (uLink: SocialLink) => uLink.name === link.name
      );
      if (userLink) {
        return {
          ...link,
          url: userLink.url,
          enabled: userLink.enabled,
        };
      }
      return link;
    });
    setDevTreeLinks(updatedData);
    setInitialLinks(updatedData);
  }, []);

  const hasChanges = () => {
    return JSON.stringify(devTreeLinks) !== JSON.stringify(initialLinks);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDevTreeLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (link.name !== name) return link;

        const isValid = isValidUrl(value);

        return {
          ...link,
          url: value,
          enabled: isValid ? link.enabled : false, // 🔑 si deja de ser válida, se desactiva
        };
      })
    );
  };

  const handleEnableToggle = (name: string) => {
    setDevTreeLinks((prevLinks) =>
      prevLinks.map((link) => {
        if (link.name === name) {
          if (!isValidUrl(link.url)) {
            toast.error("Por favor ingresa una URL válida antes de activar.");
            return link;
          }
          return { ...link, enabled: !link.enabled };
        }
        return link;
      })
    );
  };

  const handleSave = () => {
    if (!hasChanges()) {
      toast.error("No hay cambios para guardar.");
      return;
    }

    if (!hasValidUrls(devTreeLinks)) return;

    mutate({
      ...data,
      links: JSON.stringify(devTreeLinks),
    });
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-5">
        {devTreeLinks.map((link) => (
          <DevTreeInput
            key={link.name}
            link={link}
            handleUrlChange={handleUrlChange}
            handleEnableToggle={handleEnableToggle}
            name={link.name}
          />
        ))}

        <button
          onClick={handleSave}
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        >
          Guardar Cambios
        </button>
      </div>
    </>
  );
}
