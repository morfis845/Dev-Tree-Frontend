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
  const queryClient = useQueryClient();
  const data: User = queryClient.getQueryData(["getUser"])!;

  const resetQuery = (updatedLinks: typeof devTreeLinks) => {
    setDevTreeLinks(updatedLinks);
    queryClient.setQueryData(["getUser"], (oldData: User) => {
      return {
        ...oldData,
        links: JSON.stringify(updatedLinks),
      };
    });
  };

  const { mutate } = useMutation({
    mutationFn: updateUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Actualizado correctamente");
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
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name !== name) return link;

      const isValid = isValidUrl(value);

      return {
        ...link,
        url: value,
        enabled: isValid ? link.enabled : false, // 🔑 si deja de ser válida, se desactiva
      };
    });

    setDevTreeLinks(updatedLinks);
    resetQuery(updatedLinks);
  };

  const handleEnableToggle = (name: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === name) {
        if (!isValidUrl(link.url)) {
          toast.error("Por favor ingresa una URL válida antes de activar.");
          return link;
        }
        return { ...link, enabled: !link.enabled };
      }
      return link;
    });
    resetQuery(updatedLinks);
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
          onClick={() => mutate(data)}
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
        >
          Guardar Cambios
        </button>
      </div>
    </>
  );
}
