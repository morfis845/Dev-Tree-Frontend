import DevTreeInput from "@/components/DevTreeInput";
import { social } from "../data/social";
import { useState } from "react";

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social);

  return (
    <>
      <div className="flex flex-1 flex-col gap-5">
        {devTreeLinks.map((link) => (
          <DevTreeInput key={link.name} link={link} />
        ))}
      </div>
    </>
  );
}
