import DevTreeInput from "@/components/DevTreeInput";
import { social } from "../data/social";
import { useState } from "react";
import { isValidUrl } from "@/utils";
import { toast } from "sonner";

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);

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
  };

  const handleEnableToggle = (e: boolean, name: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.enabled !== e && link.name === name) {
        if (isValidUrl(link.url) || !e) {
          return { ...link, enabled: e };
        } else {
          toast.error(
            "Por favor ingresa una URL válida antes de habilitar el enlace."
          );
        }
      }
      return link;
    });
    setDevTreeLinks(updatedLinks);
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
      </div>
    </>
  );
}
