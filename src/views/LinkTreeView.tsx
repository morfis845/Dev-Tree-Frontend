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
      toast.error(`La URL de ${invalidLink.name} no es válida.`, {
        id: `invalid-url-${invalidLink.name}`,
      });
      return false;
    }

    return true;
  };

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      toast.error(error.message, { id: "update-error" });
    },
    onSuccess: (response) => {
      toast.success(response.message ?? "Actualizado correctamente", {
        id: "update-success",
      });

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

    setDevTreeLinks((prevLinks) => {
      const nextLinks = prevLinks.map((link) => {
        if (link.name !== name) return link;

        const isValid = isValidUrl(value);

        return {
          ...link,
          url: value,
          enabled: isValid ? link.enabled : false, // 🔑 si deja de ser válida, se desactiva
        };
      });

      const selectedLink = nextLinks.find((linkv) => linkv.name === name);
      const linksSaved: SocialLink[] = JSON.parse(data.links);
      let updatedItem: SocialLink[] = [];
      if (selectedLink) {
        const newItem = {
          ...selectedLink,
          id: linksSaved.length + 1,
        };
        updatedItem = [...linksSaved, newItem];
      }

      // Actualiza el preview (ProfileView/DevTree) inmediatamente
      queryClient.setQueryData(["getUser"], (oldData: User | undefined) =>
        oldData
          ? {
              ...oldData,
              links: JSON.stringify(updatedItem),
            }
          : oldData
      );

      const i = queryClient.getQueryData<User>(["getUser"]);
      console.log("Usuario al cambiar URL:", i);
      return nextLinks;
    });
  };

  const handleEnableToggle = (name: string) => {
    setDevTreeLinks((prevLinks) => {
      const nextLinks = prevLinks.map((link) => {
        if (link.name === name) {
          if (!isValidUrl(link.url)) {
            toast.error("Por favor ingresa una URL válida antes de activar.", {
              id: `invalid-url-toggle-${name}`,
            });
            return link;
          }
          return { ...link, enabled: !link.enabled };
        }
        return link;
      });

      // Actualiza solo el `enabled` del link dentro de `data.links`,
      // conservando el resto de información intacta.
      const selectedLink = nextLinks.find((linkv) => linkv.name === name);
      const linksSaved: SocialLink[] = JSON.parse(data.links);
      let updatedLinks: SocialLink[] = linksSaved;
      if (selectedLink) {
        updatedLinks = linksSaved.map((l) =>
          l.name === selectedLink.name
            ? { ...l, enabled: selectedLink.enabled }
            : l
        );
        console.log(
          "Toggle aplicado:",
          selectedLink.name,
          "=>",
          selectedLink.enabled
        );
      }

      // Refleja de inmediato el toggle en el preview
      queryClient.setQueryData(["getUser"], (oldData: User | undefined) =>
        oldData
          ? {
              ...oldData,
              links: JSON.stringify(updatedLinks),
            }
          : oldData
      );

      return nextLinks;
    });
  };

  const handleSave = () => {
    if (!hasChanges()) {
      toast.error("No hay cambios para guardar.");
      return;
    }

    if (!hasValidUrls(devTreeLinks)) return;
    console.log(devTreeLinks);

    const i = queryClient.getQueryData<User>(["getUser"]);
    console.log("Usuario al guardar:", i);

    mutate({
      ...data,
      links: i!.links,
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
