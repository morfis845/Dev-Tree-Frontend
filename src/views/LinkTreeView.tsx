import DevTreeInput from "@/components/DevTreeInput";
import { social } from "../data/social";
import { useState } from "react";

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.name === e.target.name) {
        return { ...link, url: e.target.value };
      }
      return link;
    });
    setDevTreeLinks(updatedLinks);
  };

  const handleEnableToggle = (e: boolean, name: string) => {
    const updatedLinks = devTreeLinks.map((link) => {
      if (link.enabled !== e && link.name === name) {
        return { ...link, enabled: e };
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
